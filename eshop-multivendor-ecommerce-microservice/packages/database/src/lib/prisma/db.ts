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
    images: {
      model: 'images',
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
              usersId: {
                nullable: true,
                type: {
                  codecId: 'mongo/string@1',
                  kind: 'scalar',
                },
              },
            },
            relations: {
              users: {
                cardinality: 'N:1',
                on: {
                  localFields: ['usersId'],
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
                  targetFields: ['usersId'],
                },
                to: {
                  model: 'images',
                  namespace: '__unbound__',
                },
              },
            },
            storage: {
              collection: 'users',
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
            images: {
              indexes: [
                {
                  keys: [
                    {
                      direction: 1,
                      field: 'usersId',
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
                    updatedAt: {
                      bsonType: 'date',
                    },
                    url: {
                      bsonType: 'string',
                    },
                    usersId: {
                      bsonType: ['null', 'string'],
                    },
                  },
                  required: ['_id', 'createdAt', 'file_id', 'updatedAt', 'url'],
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
      '8b1765d59b985696b7e2b805c643c06b893527ec21d56347c6d57c8c4105dda8',
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
