import { connectToDatabase } from "./db";
import { Purchase } from "./models";

export async function markPurchased(
  username: string, 
  courseId: string, 
  stripeSessionId?: string,
  amountPaid: number = 0
) {
  await connectToDatabase();

  const lowercaseUsername = username.toLowerCase();

  // Use findOneAndUpdate with upsert to safely prevent duplicates on duplicate webhook/confirm calls
  await Purchase.findOneAndUpdate(
    { 
      username: lowercaseUsername, 
      courseId 
    },
    {
      username: lowercaseUsername,
      courseId,
      stripeSessionId,
      status: "paid",
      amountPaid,
      createdAt: new Date(),
    },
    { 
      upsert: true, 
      new: true 
    }
  );
}

export async function getPurchasedCourseIds(username: string): Promise<string[]> {
  await connectToDatabase();

  const lowercaseUsername = username.toLowerCase();
  
  const purchases = await Purchase.find({ 
    username: lowercaseUsername, 
    status: "paid" 
  });

  return purchases.map((purchase) => purchase.courseId.toString());
}
