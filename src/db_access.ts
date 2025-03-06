import {z} from "zod";
import { PrismaClient, type Category } from "@prisma/client";



const Question = z.object({
    question: z.string(),
    answers: z.array(z.string()).max(4)
  })

const CategoryInput = z.object ({
    title : z.string().min(2,'min 2 characters').max(100,'max 100 characters'),
    slug : z.string().min(3).max(100),
    questions : z.array(Question).max(20)
})

const CategoryOutput = z.object ({
    id : z.number(),
    title : z.string().min(2,'min 2 characters').max(100,'max 100 characters'),
    slug : z.string().min(3).max(100),
    questions : z.array(Question).max(20,"max 20 questions").optional(),
})

const  CategoriesOutput = z.array(CategoryOutput);

// Categories

export async function getCategories() : Promise <Array<Category>> {
    const prisma = new PrismaClient();  
    const categories = await prisma.category.findMany()
    await prisma.$disconnect();
    return categories;
}  

export async function getCategory(slugInput : string) {
    const prisma = new PrismaClient();
    const category = await prisma.category.findUnique({
      where: { slug: slugInput }, 
      include: { questions: true }, 
    });
    await prisma.$disconnect();
    return category;
}

export async function postCategory(cat: any) {
  const prisma = new PrismaClient();

    try {
      // ChatGPT hjálpaði að gera þetta rétt þannig það væri empty array í questions

      const newCategory = await prisma.category.create({
        data: {
          title: cat.title,
          slug: cat.slug,
          questions: cat.questions?.length
            ? {
                create: cat.questions.map((q: any) => ({
                  question: q.question,
                  answers: q.answers,
                })),
              }
            : undefined, 
        },
        include: { questions: true },
      });
    

    return newCategory;
  } catch (error) {
    return false;
  } finally {
    await prisma.$disconnect(); 
  }
}

// ChatGPT gerði þessa function og svo lagaði ég nokkur atriði
// Fann ekki hvernig ég get updateað spurningarnar líka


export async function patchCategory(
  slug: string,
  updatedData: Partial<{ title: string }>
) {
  const prisma = new PrismaClient(); 

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) {
    return null;
  }

  if (!updatedData.title) {
    return category; 
  }

  console.log("Updating category with title:", updatedData.title);


  const updatedCategory = await prisma.category.update({
    where: { slug },
    data: { title: updatedData.title },
  });

  return updatedCategory; 
}




export async function deleteCategory(slug: string) {
  const prisma = new PrismaClient();

  try {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      return null;
    }

    await prisma.category.delete({ where: { slug } });

    return { message: "Category deleted successfully" };
  } catch (error) {
    return { error: "Something went wrong", details: error };
  } finally {
    await prisma.$disconnect(); 
  }
}

// Questions

export function getQuestions() {
    const prisma = new PrismaClient;
    return [];
}  
export function getQuestionByCategory(slug : string) {
    const prisma = new PrismaClient;
    return null;
}

export function postQuestion(cat : JSON) {
    const prisma = new PrismaClient;
    
}
export function patchQuestion(slug : string) {
    return null;
}
export function deleteQuestion(slug : string) {
    const prisma = new PrismaClient;
    return null;
}

// Hjálparföll

export function validateQuestion(que : unknown) {
    return Question.safeParse(que);
}

export function validateCategoryInput(cat : unknown) {
    return CategoryInput.safeParse(cat);
}

export function validateCategoryOutput(cat : unknown) {
    return CategoryOutput.safeParse(cat);
}

export function validateCategories(cat : unknown) {
    return CategoriesOutput.safeParse(cat)
}