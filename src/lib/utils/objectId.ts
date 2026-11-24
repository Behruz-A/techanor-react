const MONGO_OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

export const isMongoObjectId = (value: string): boolean => MONGO_OBJECT_ID_PATTERN.test(value);
