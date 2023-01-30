interface Collection {
  id: string;
  name: string;
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
  userId: string;
  isDocumentBased: boolean;
  fields?: Field[];
  public: boolean;
}

interface Team {
  id: string;
  name: string;
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
  userId: string;
  teamMembers: string[];
}

interface Permission {
  id: string;
  name: string;
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
  userId: string;
  collectionId: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
  active: boolean;
}

interface Field {
  id?: string;
  name: string;
  type: FieldType;
  options: {
    unique?: boolean;
    nullable?: boolean;
    maxLength?: number;
    default?: any;
    array?: boolean;
    custom?: any;
  };
  userId?: string;
  collectionId?: string;
}

enum FieldType {
  INT = "INT",
  FLOAT = "FLOAT",
  TEXT = "TEXT",
  JSON = "JSON",
  JSONB = "JSONB",
  TIMESTAMP = "TIMESTAMP",
  CUSTOM = "CUSTOM",
}

type UserWithoutPassword = Omit<User, "password">;

export {
  Collection,
  Team,
  Permission,
  User,
  UserWithoutPassword,
  Field,
  FieldType,
};
