("use strict");
const stripe = require("stripe")(process.env.STRIPE_KEY);
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, customer_details } = ctx.request.body;
    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          try {
            // Fetch the product from the database
            const item = await strapi
              .service("api::product.product")
              .findOne(product.id, {
                populate: "details", // Populate the details field
              });

            // Calculate the price of selected extra options based on their IDs
            let selectedOptionsTotal = 0;
            if (product.selectedOptions) {
              Object.keys(product.selectedOptions).forEach((key) => {
                const selectedOption = product.selectedOptions[key];
                const correspondingDetail = item.details.find(
                  (detail) => detail.id === selectedOption.id && detail.__component === selectedOption.__component
                );
                if (correspondingDetail && selectedOption.price) {
                  selectedOptionsTotal += selectedOption.price;
                }
              });
            }

            // Calculate the total price for this product (base price + extra options price) * quantity
            const totalPrice = (item.price + selectedOptionsTotal);


            return {
              price_data: {
                currency: "inr",
                product_data: {
                  name: item.title,
                },
                unit_amount: Math.round(totalPrice * 100), // Stripe expects the amount in the smallest currency unit
              },
              quantity: product.quantity, // Since we already multiplied by quantity, this is set to 1
            };
          } catch (error) {
            console.error(`Error processing product ${product.id}:`, error);
            throw error;
          }
        })
      );



      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: process.env.CLIENT_URL + `/success`,
        cancel_url: process.env.CLIENT_URL + "/",
        line_items: lineItems,

      });


      // Save the order in the database
      await strapi
        .service("api::order.order")
        .create({ data: { stripeId: session.id, products, firstName: customer_details.firstName, lastName: customer_details.lastName, email: customer_details.email, region: customer_details.region, address: customer_details.address, city: customer_details.city, emirate: customer_details.emirate, phone: customer_details.phone } });

      return { stripeSession: session };
    } catch (error) {
      ctx.response.status = 500;
      console.log("error", error)
      return { error };
    }
  },
}));

