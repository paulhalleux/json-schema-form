import type { ObjectSchema } from "@phalleux/jsf-schema-utils";

import type { SchemaExampleCategory } from "../types/examples.ts";

const UserProfile: ObjectSchema = {
  $id: "https://example.com/user-profile.schema.json",
  type: "object",
  title: "User Profile",
  description: "Represents a user's profile with basic information.",
  properties: {
    username: {
      type: "string",
      title: "Username",
      description: "A unique identifier for the user.",
    },
    bio: {
      type: "string",
      title: "Bio",
      description: "A short description about the user.",
    },
    avatar: {
      type: "string",
      format: "uri",
      title: "Avatar",
      description: "A URL to the user's profile picture.",
    },
  },
  required: ["username"],
};

const Address: ObjectSchema = {
  $id: "https://example.com/address.schema.json",
  type: "object",
  title: "Address",
  description: "Represents a postal address.",
  properties: {
    postOfficeBox: {
      type: "string",
      title: "PO Box",
      description: "A post office box number, if applicable.",
    },
    extendedAddress: {
      type: "string",
      title: "Extended Address",
      description: "Additional address details, such as an apartment number.",
    },
    streetAddress: {
      type: "string",
      title: "Street Address",
      description: "The primary street address.",
    },
    locality: {
      type: "string",
      title: "City",
      description: "The city or locality of the address.",
    },
    region: {
      type: "string",
      title: "State/Province",
      description: "The state or province of the address.",
    },
    postalCode: {
      type: "string",
      title: "Postal Code",
      description: "The postal or ZIP code of the address.",
    },
    countryName: {
      type: "string",
      title: "Country",
      description: "The country name of the address.",
    },
  },
  required: ["locality", "region", "countryName"],
  dependentRequired: {
    postOfficeBox: ["streetAddress"],
    extendedAddress: ["streetAddress"],
  },
};

const BlogPost: ObjectSchema = {
  $id: "https://example.com/blog-post.schema.json",
  type: "object",
  title: "Blog Post",
  description: "Represents a blog post with content and metadata.",
  required: ["title", "content", "author"],
  properties: {
    title: {
      type: "string",
      title: "Title",
      description: "The title of the blog post.",
    },
    content: {
      type: "string",
      title: "Content",
      description: "The main content of the blog post.",
    },
    publishedDate: {
      type: "string",
      format: "date-time",
      title: "Published Date",
      description: "The date and time the post was published.",
    },
    author: {
      $ref: "https://example.com/user-profile.schema.json",
      title: "Author",
      description: "The author of the blog post.",
    },
    tags: {
      type: "array",
      title: "Tags",
      description: "A list of tags associated with the blog post.",
      items: {
        type: "string",
      },
    },
  },
};

const Person: ObjectSchema = {
  $id: "https://example.com/person.schema.json",
  type: "object",
  title: "Person",
  description: "Represents an individual with personal details.",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
      description: "The person's first name.",
    },
    lastName: {
      type: "string",
      title: "Last Name",
      description: "The person's last name.",
    },
    age: {
      type: "integer",
      minimum: 0,
      title: "Age",
      description: "The person's age (must be non-negative).",
    },
    email: {
      type: "string",
      format: "email",
      title: "Email",
      description: "The person's email address.",
    },
  },
};

const Organization: ObjectSchema = {
  $id: "https://example.com/organization.schema.json",
  type: "object",
  title: "Organization",
  description: "Represents a company or organization.",
  properties: {
    name: {
      type: "string",
      title: "Name",
      description: "The official name of the organization.",
    },
    url: {
      type: "string",
      format: "uri",
      title: "Website URL",
      description: "The official website of the organization.",
    },
    logo: {
      type: "string",
      format: "uri",
      title: "Logo",
      description: "A URL to the organization's logo.",
    },
  },
  required: ["name"],
};

const Product: ObjectSchema = {
  $id: "https://example.com/product.schema.json",
  type: "object",
  title: "Product",
  description: "Represents a product available for sale.",
  properties: {
    name: {
      type: "string",
      title: "Product Name",
      description: "The name of the product.",
    },
    description: {
      type: "string",
      title: "Description",
      description: "A detailed description of the product.",
    },
    price: {
      type: "number",
      minimum: 0,
      title: "Price",
      description: "The price of the product in the specified currency.",
    },
    currency: {
      type: "string",
      pattern: "^[A-Z]{3}$",
      title: "Currency",
      description: "The currency code (ISO 4217) for the price.",
    },
  },
  required: ["name", "price", "currency"],
};

const Cart: ObjectSchema = {
  $id: "https://example.com/cart.schema.json",
  type: "object",
  title: "Shopping Cart",
  description: "Represents a shopping cart containing items.",
  properties: {
    items: {
      type: "array",
      title: "Items",
      description: "A list of items in the shopping cart.",
      items: {
        $ref: "https://example.com/cart-item.schema.json",
      },
    },
    total: {
      type: "number",
      minimum: 0,
      title: "Total Price",
      description: "The total price of all items in the cart.",
    },
  },
  required: ["items", "total"],
};

const CartItem: ObjectSchema = {
  $id: "https://example.com/cart-item.schema.json",
  type: "object",
  title: "Cart Item",
  description: "Represents an individual item in a shopping cart.",
  properties: {
    product: {
      "x-renderer": "carded",
      $ref: "https://example.com/product.schema.json",
      title: "Product",
      description: "The product added to the cart.",
    },
    quantity: {
      type: "integer",
      minimum: 1,
      title: "Quantity",
      description: "The quantity of the product in the cart.",
    },
  },
  required: ["product", "quantity"],
};

export const CompleteExamples: SchemaExampleCategory = {
  id: "complete",
  title: "Complete",
  children: [
    {
      id: "complete-address",
      title: "Address",
      schema: Address,
    },
    {
      id: "complete-blog-post",
      title: "Blog Post",
      schema: BlogPost,
    },
    {
      id: "complete-user-profile",
      title: "User Profile",
      schema: UserProfile,
    },
    {
      id: "complete-person",
      title: "Person",
      schema: Person,
    },
    {
      id: "complete-organization",
      title: "Organization",
      schema: Organization,
    },
    {
      id: "complete-product",
      title: "Product",
      schema: Product,
    },
    {
      id: "complete-cart",
      title: "Cart",
      schema: Cart,
    },
    {
      id: "complete-cart-item",
      title: "Cart Item",
      schema: CartItem,
    },
  ],
};

export const CompleteSchemas = [
  UserProfile,
  Address,
  BlogPost,
  Person,
  Organization,
  Product,
  Cart,
  CartItem,
];
