import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: { user_id: userId },
    select: {
      stripe_subscription_id: true,
      stripe_current_period_end: true,
      stripe_customer_id: true,
      stripe_price_id: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.stripe_price_id &&
    userSubscription.stripe_current_period_end?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid;
};