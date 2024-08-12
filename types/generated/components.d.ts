import type { Schema, Attribute } from '@strapi/strapi';

export interface MobileMobile extends Schema.Component {
  collectionName: 'components_mobile_mobiles';
  info: {
    displayName: 'mobile';
  };
  attributes: {};
}

export interface LaptopStorage extends Schema.Component {
  collectionName: 'components_laptop_storages';
  info: {
    displayName: 'storage';
  };
  attributes: {
    storage: Attribute.String;
    price: Attribute.Decimal;
  };
}

export interface LaptopScreenSize extends Schema.Component {
  collectionName: 'components_laptop_screen_sizes';
  info: {
    displayName: 'screenSize';
  };
  attributes: {
    size: Attribute.String;
  };
}

export interface LaptopRam extends Schema.Component {
  collectionName: 'components_laptop_rams';
  info: {
    displayName: 'RAM';
  };
  attributes: {
    ram: Attribute.String;
    price: Attribute.Decimal;
  };
}

export interface LaptopLaptopDetails extends Schema.Component {
  collectionName: 'components_laptop_laptop_details';
  info: {
    displayName: 'LaptopDetails';
    description: '';
  };
  attributes: {
    keyboard: Attribute.String;
    condition: Attribute.Enumeration<['excellent']>;
    screen: Attribute.String;
    model: Attribute.String;
    graphics: Attribute.String;
    weight: Attribute.String;
    CPU: Attribute.String;
    resolution: Attribute.String;
    OS: Attribute.Enumeration<['windows']>;
    wifi: Attribute.Enumeration<['yes', 'no']>;
    camera: Attribute.String;
    audio: Attribute.String;
    brand: Attribute.Enumeration<['HP', 'DELL']>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'mobile.mobile': MobileMobile;
      'laptop.storage': LaptopStorage;
      'laptop.screen-size': LaptopScreenSize;
      'laptop.ram': LaptopRam;
      'laptop.laptop-details': LaptopLaptopDetails;
    }
  }
}
