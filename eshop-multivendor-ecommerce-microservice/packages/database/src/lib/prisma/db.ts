import 'dotenv/config';
import mongo from '@prisma/orm-mongo/runtime';
import type { Contract } from './contract.d';
// import contractJson from './contract.json' with { type: 'json' }; // WARNING - Import attributes are not allowed on statements that compile to CommonJS 'require' calls.

// const contractJson = require('./contract.json');

const contractJson = {
  schemaVersion: '1',
  targetFamily: 'mongo',
  target: 'mongo',
  profileHash:
    '251b3ce23f6c9f561892e7c1af9d2cc941a13d64ba1aa7226b90036b09568cc3',
  roots: {
    discount_codes: {
      model: 'discount_codes',
      namespace: '__unbound__',
    },
    images: {
      model: 'images',
      namespace: '__unbound__',
    },
    sellers: {
      model: 'sellers',
      namespace: '__unbound__',
    },
    shopReviews: {
      model: 'shopReviews',
      namespace: '__unbound__',
    },
    shops: {
      model: 'shops',
      namespace: '__unbound__',
    },
    site_config: {
      model: 'site_config',
      namespace: '__unbound__',
    },
    users: {
      model: 'users',
      namespace: '__unbound__',
    },
  },
  domain: {
    namespaces: {
      __unbound__: {
        models: {
          discount_codes: {
            fields: {
              _id: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              discountCode: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              discountType: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              discountValue: {
                nullable: false,
                type: {
                  codecId: 'mongo/double@1',
                  kind: 'scalar',
                },
              },
              public_name: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              sellerId: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
            },
            relations: {
              sellers: {
                cardinality: 'N:1',
                on: {
                  localFields: ['sellerId'],
                  targetFields: ['_id'],
                },
                to: {
                  model: 'sellers',
                  namespace: '__unbound__',
                },
              },
            },
            storage: {
              collection: 'discount_codes',
            },
          },
          images: {
            fields: {
              _id: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              altText: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              file_id: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              shopId: {
                nullable: true,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              url: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              userId: {
                nullable: true,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
            },
            relations: {
              shops: {
                cardinality: 'N:1',
                on: {
                  localFields: ['shopId'],
                  targetFields: ['_id'],
                },
                to: {
                  model: 'shops',
                  namespace: '__unbound__',
                },
              },
              users: {
                cardinality: 'N:1',
                on: {
                  localFields: ['userId'],
                  targetFields: ['_id'],
                },
                to: {
                  model: 'users',
                  namespace: '__unbound__',
                },
              },
            },
            storage: {
              collection: 'images',
            },
          },
          sellers: {
            fields: {
              _id: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              country: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              email: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              name: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              password: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              phone_number: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              stripeId: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
            },
            relations: {
              shop: {
                cardinality: '1:1',
                on: {
                  localFields: ['_id'],
                  targetFields: ['sellerId'],
                },
                to: {
                  model: 'shops',
                  namespace: '__unbound__',
                },
              },
            },
            storage: {
              collection: 'sellers',
            },
          },
          shopReviews: {
            fields: {
              _id: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              rating: {
                nullable: false,
                type: {
                  codecId: 'mongo/double@1',
                  kind: 'scalar',
                },
              },
              review: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              shopId: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              userId: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
            },
            relations: {
              shops: {
                cardinality: 'N:1',
                on: {
                  localFields: ['shopId'],
                  targetFields: ['_id'],
                },
                to: {
                  model: 'shops',
                  namespace: '__unbound__',
                },
              },
              users: {
                cardinality: 'N:1',
                on: {
                  localFields: ['userId'],
                  targetFields: ['_id'],
                },
                to: {
                  model: 'users',
                  namespace: '__unbound__',
                },
              },
            },
            storage: {
              collection: 'shopReviews',
            },
          },
          shops: {
            fields: {
              _id: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              address: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              bio: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              category: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              coverBanner: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              name: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              opening_hours: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              ratings: {
                nullable: false,
                type: {
                  codecId: 'mongo/double@1',
                  kind: 'scalar',
                },
              },
              sellerId: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              socialLinks: {
                nullable: true,
                type: {
                  kind: 'valueObject',
                  name: 'SocialLinks',
                },
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              website: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
            },
            relations: {
              avatar: {
                cardinality: '1:1',
                on: {
                  localFields: ['_id'],
                  targetFields: ['shopId'],
                },
                to: {
                  model: 'images',
                  namespace: '__unbound__',
                },
              },
              reviews: {
                cardinality: '1:N',
                on: {
                  localFields: ['_id'],
                  targetFields: ['shopId'],
                },
                to: {
                  model: 'shopReviews',
                  namespace: '__unbound__',
                },
              },
              sellers: {
                cardinality: 'N:1',
                on: {
                  localFields: ['sellerId'],
                  targetFields: ['_id'],
                },
                to: {
                  model: 'sellers',
                  namespace: '__unbound__',
                },
              },
            },
            storage: {
              collection: 'shops',
            },
          },
          site_config: {
            fields: {
              _id: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              categories: {
                many: true,
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              subcategories: {
                many: true,
                nullable: false,
                type: {
                  kind: 'valueObject',
                  name: 'Subcategory',
                },
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
            },
            relations: {},
            storage: {
              collection: 'site_config',
            },
          },
          users: {
            fields: {
              _id: {
                nullable: false,
                type: {
                  codecId: 'mongo/objectId@1',
                  kind: 'scalar',
                },
              },
              createdAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
              email: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              following: {
                many: true,
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              name: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              password: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              updatedAt: {
                nullable: false,
                type: {
                  codecId: 'mongo/date@1',
                  kind: 'scalar',
                },
              },
            },
            relations: {
              avatar: {
                cardinality: '1:1',
                on: {
                  localFields: ['_id'],
                  targetFields: ['userId'],
                },
                to: {
                  model: 'images',
                  namespace: '__unbound__',
                },
              },
              shopReviews: {
                cardinality: '1:N',
                on: {
                  localFields: ['_id'],
                  targetFields: ['userId'],
                },
                to: {
                  model: 'shopReviews',
                  namespace: '__unbound__',
                },
              },
            },
            storage: {
              collection: 'users',
            },
          },
        },
        valueObjects: {
          SocialLinks: {
            fields: {
              facebook: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              instagram: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              x: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              youtube: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
            },
          },
          Subcategory: {
            fields: {
              category: {
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
              items: {
                many: true,
                nullable: false,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
            },
          },
        },
      },
    },
  },
  storage: {
    namespaces: {
      __unbound__: {
        entries: {
          collection: {
            discount_codes: {
              indexes: [
                {
                  keys: [
                    {
                      direction: 1,
                      field: 'discountCode',
                    },
                  ],
                  kind: 'mongo-index',
                  unique: true,
                },
              ],
              kind: 'mongo-collection',
              validator: {
                jsonSchema: {
                  additionalProperties: false,
                  bsonType: 'object',
                  properties: {
                    _id: {
                      bsonType: 'objectId',
                    },
                    createdAt: {
                      bsonType: 'date',
                    },
                    discountCode: {
                      bsonType: 'string',
                    },
                    discountType: {
                      bsonType: 'string',
                    },
                    discountValue: {
                      bsonType: 'double',
                    },
                    public_name: {
                      bsonType: 'string',
                    },
                    sellerId: {
                      bsonType: 'objectId',
                    },
                    updatedAt: {
                      bsonType: 'date',
                    },
                  },
                  required: [
                    '_id',
                    'createdAt',
                    'discountCode',
                    'discountType',
                    'discountValue',
                    'public_name',
                    'sellerId',
                    'updatedAt',
                  ],
                },
                kind: 'mongo-validator',
                validationAction: 'error',
                validationLevel: 'strict',
              },
            },
            images: {
              indexes: [
                {
                  keys: [
                    {
                      direction: 1,
                      field: 'userId',
                    },
                  ],
                  kind: 'mongo-index',
                  unique: true,
                },
                {
                  keys: [
                    {
                      direction: 1,
                      field: 'shopId',
                    },
                  ],
                  kind: 'mongo-index',
                  unique: true,
                },
              ],
              kind: 'mongo-collection',
              validator: {
                jsonSchema: {
                  additionalProperties: false,
                  bsonType: 'object',
                  properties: {
                    _id: {
                      bsonType: 'objectId',
                    },
                    altText: {
                      bsonType: ['null', 'string'],
                    },
                    createdAt: {
                      bsonType: 'date',
                    },
                    file_id: {
                      bsonType: 'string',
                    },
                    shopId: {
                      bsonType: ['null', 'objectId'],
                    },
                    updatedAt: {
                      bsonType: 'date',
                    },
                    url: {
                      bsonType: 'string',
                    },
                    userId: {
                      bsonType: ['null', 'objectId'],
                    },
                  },
                  required: ['_id', 'createdAt', 'file_id', 'updatedAt', 'url'],
                },
                kind: 'mongo-validator',
                validationAction: 'error',
                validationLevel: 'strict',
              },
            },
            sellers: {
              indexes: [
                {
                  keys: [
                    {
                      direction: 1,
                      field: 'email',
                    },
                  ],
                  kind: 'mongo-index',
                  unique: true,
                },
                {
                  keys: [
                    {
                      direction: 1,
                      field: 'stripeId',
                    },
                  ],
                  kind: 'mongo-index',
                  unique: true,
                },
              ],
              kind: 'mongo-collection',
              validator: {
                jsonSchema: {
                  additionalProperties: false,
                  bsonType: 'object',
                  properties: {
                    _id: {
                      bsonType: 'objectId',
                    },
                    country: {
                      bsonType: 'string',
                    },
                    createdAt: {
                      bsonType: 'date',
                    },
                    email: {
                      bsonType: 'string',
                    },
                    name: {
                      bsonType: 'string',
                    },
                    password: {
                      bsonType: 'string',
                    },
                    phone_number: {
                      bsonType: 'string',
                    },
                    stripeId: {
                      bsonType: ['null', 'string'],
                    },
                    updatedAt: {
                      bsonType: 'date',
                    },
                  },
                  required: [
                    '_id',
                    'country',
                    'createdAt',
                    'email',
                    'name',
                    'password',
                    'phone_number',
                    'updatedAt',
                  ],
                },
                kind: 'mongo-validator',
                validationAction: 'error',
                validationLevel: 'strict',
              },
            },
            shopReviews: {
              kind: 'mongo-collection',
              validator: {
                jsonSchema: {
                  additionalProperties: false,
                  bsonType: 'object',
                  properties: {
                    _id: {
                      bsonType: 'objectId',
                    },
                    createdAt: {
                      bsonType: 'date',
                    },
                    rating: {
                      bsonType: 'double',
                    },
                    review: {
                      bsonType: ['null', 'string'],
                    },
                    shopId: {
                      bsonType: 'objectId',
                    },
                    updatedAt: {
                      bsonType: 'date',
                    },
                    userId: {
                      bsonType: 'objectId',
                    },
                  },
                  required: [
                    '_id',
                    'createdAt',
                    'rating',
                    'shopId',
                    'updatedAt',
                    'userId',
                  ],
                },
                kind: 'mongo-validator',
                validationAction: 'error',
                validationLevel: 'strict',
              },
            },
            shops: {
              indexes: [
                {
                  keys: [
                    {
                      direction: 1,
                      field: 'sellerId',
                    },
                  ],
                  kind: 'mongo-index',
                  unique: true,
                },
              ],
              kind: 'mongo-collection',
              validator: {
                jsonSchema: {
                  additionalProperties: false,
                  bsonType: 'object',
                  properties: {
                    _id: {
                      bsonType: 'objectId',
                    },
                    address: {
                      bsonType: 'string',
                    },
                    bio: {
                      bsonType: ['null', 'string'],
                    },
                    category: {
                      bsonType: 'string',
                    },
                    coverBanner: {
                      bsonType: ['null', 'string'],
                    },
                    createdAt: {
                      bsonType: 'date',
                    },
                    name: {
                      bsonType: 'string',
                    },
                    opening_hours: {
                      bsonType: ['null', 'string'],
                    },
                    ratings: {
                      bsonType: 'double',
                    },
                    sellerId: {
                      bsonType: 'objectId',
                    },
                    socialLinks: {
                      oneOf: [
                        {
                          bsonType: 'null',
                        },
                        {
                          additionalProperties: false,
                          bsonType: 'object',
                          properties: {
                            facebook: {
                              bsonType: ['null', 'string'],
                            },
                            instagram: {
                              bsonType: ['null', 'string'],
                            },
                            x: {
                              bsonType: ['null', 'string'],
                            },
                            youtube: {
                              bsonType: ['null', 'string'],
                            },
                          },
                        },
                      ],
                    },
                    updatedAt: {
                      bsonType: 'date',
                    },
                    website: {
                      bsonType: ['null', 'string'],
                    },
                  },
                  required: [
                    '_id',
                    'address',
                    'category',
                    'createdAt',
                    'name',
                    'ratings',
                    'sellerId',
                    'updatedAt',
                  ],
                },
                kind: 'mongo-validator',
                validationAction: 'error',
                validationLevel: 'strict',
              },
            },
            site_config: {
              kind: 'mongo-collection',
              validator: {
                jsonSchema: {
                  additionalProperties: false,
                  bsonType: 'object',
                  properties: {
                    _id: {
                      bsonType: 'objectId',
                    },
                    categories: {
                      bsonType: 'array',
                      items: {
                        bsonType: 'string',
                      },
                    },
                    createdAt: {
                      bsonType: 'date',
                    },
                    subcategories: {
                      bsonType: 'array',
                      items: {
                        additionalProperties: false,
                        bsonType: 'object',
                        properties: {
                          category: {
                            bsonType: 'string',
                          },
                          items: {
                            bsonType: 'array',
                            items: {
                              bsonType: 'string',
                            },
                          },
                        },
                        required: ['category', 'items'],
                      },
                    },
                    updatedAt: {
                      bsonType: 'date',
                    },
                  },
                  required: [
                    '_id',
                    'categories',
                    'createdAt',
                    'subcategories',
                    'updatedAt',
                  ],
                },
                kind: 'mongo-validator',
                validationAction: 'error',
                validationLevel: 'strict',
              },
            },
            users: {
              indexes: [
                {
                  keys: [
                    {
                      direction: 1,
                      field: 'email',
                    },
                  ],
                  kind: 'mongo-index',
                  unique: true,
                },
              ],
              kind: 'mongo-collection',
              validator: {
                jsonSchema: {
                  additionalProperties: false,
                  bsonType: 'object',
                  properties: {
                    _id: {
                      bsonType: 'objectId',
                    },
                    createdAt: {
                      bsonType: 'date',
                    },
                    email: {
                      bsonType: 'string',
                    },
                    following: {
                      bsonType: 'array',
                      items: {
                        bsonType: 'string',
                      },
                    },
                    name: {
                      bsonType: 'string',
                    },
                    password: {
                      bsonType: ['null', 'string'],
                    },
                    updatedAt: {
                      bsonType: 'date',
                    },
                  },
                  required: [
                    '_id',
                    'createdAt',
                    'email',
                    'following',
                    'name',
                    'updatedAt',
                  ],
                },
                kind: 'mongo-validator',
                validationAction: 'error',
                validationLevel: 'strict',
              },
            },
          },
        },
        id: '__unbound__',
        kind: 'mongo-database',
      },
    },
    storageHash:
      '8d719e4c8a030a778b1d3c3eef04f3009b52efb630cfe5cc0727cba0cea99a10',
  },
  capabilities: {},
  extensions: {},
  meta: {},
  _generated: {
    warning: '⚠️  GENERATED FILE - DO NOT EDIT',
    message: 'This file is automatically generated by "prisma contract emit".',
    regenerate: 'To regenerate, run: prisma contract emit',
  },
};

const DATABASE_URL = process.env['DATABASE_URL'] as string;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const prisma = mongo<Contract>({
  contractJson,
  url: DATABASE_URL,
});
