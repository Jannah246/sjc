import { CronJob } from "cron";
import { clientService, orderInternetPackageService } from "../services";
import { minuteInMilleSeconds } from ".";
import { OrderStatus } from "../types/enums";
import { getExpireSubscriptionClient } from "../services/client";

//Every minute
export const expireInternetPackageCron = new CronJob(
  "*/1 * * * *",
  async () => {
    await expireInternetPackage();
  }
);

//Everyday midnight
export const expireClientSubscriptionCron = new CronJob(
  "0 0 * * *",
  async () => {
    await expireClientSubscription();
  }
);

async function expireClientSubscription() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  const clients = await getExpireSubscriptionClient(date);
  if (!clients || !clients.length) {
    return;
  }
  const promises = [];
  for (const client of clients) {
    promises.push(clientService.updateStatus(client._id.toString(), 3));
  }

  await Promise.all(promises);
}

async function expireInternetPackage() {
  const time = new Date();
  time.setSeconds(0);
  time.setMilliseconds(0);
  const orders = await orderInternetPackageService.getExpireInternetPackage(
    time
  );
  if (!orders || !orders.length) {
    return;
  }

  const promises = [];
  for (const order of orders) {
    //Expire current package
    promises.push(orderInternetPackageService.expireInternetPackage(order._id));

    //Active upcoming package
    const upcomingPlan =
      await orderInternetPackageService.getUpcomingPendingPlanOfUser(
        order.user_id
      );
    if (upcomingPlan) {
      const starDate = new Date();
      const expireDate = new Date(starDate.getTime());
      expireDate.setTime(
        expireDate.getTime() + minuteInMilleSeconds(upcomingPlan.duration)
      );
      const updateData = {
        package_start_date: starDate,
        package_expiry_date: expireDate,
        order_status: OrderStatus.active,
      };

      promises.push(
        orderInternetPackageService.updateInternetPackage(
          upcomingPlan._id,
          updateData
        )
      );
    }
  }
  await Promise.all(promises);
}
