
import { Prisma } from '@prisma/client'

type StudentWhere = Prisma.StudentWhereInput;
const keys = Object.keys({} as StudentWhere);
console.log('Available keys in StudentWhereInput:', keys);

// Check if isActive is a property
const isActiveExists = 'isActive' in ({} as StudentWhere);
console.log('isActive exists in StudentWhereInput:', isActiveExists);
