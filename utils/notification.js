import constants from "./constants.js";
import notificationModel from "../models/notification.model.js";
import userModel from "../models/user.model.js";
import admin from "./firebase.js";

const sendNotification = async (data) => {
  try {
    const notificationData = new notificationModel({
      receiverId: data.receiverId,
      senderId: data.senderId,
      notificationTitle: data.title,
      notificationBody: data.body,
    });
    let objectId = data.id;
    let objectIdString = objectId. toString();
    const result = await notificationData.save();
    const deviceData = await userModel
      .findOne({ _id: data.receiverId })
      .select("_id email deviceToken deviceType notification");

    if (
      deviceData.deviceType === constants.CONST_DEVICE_ANDROID ||
      deviceData.deviceType === constants.CONST_DEVICE_IOS ||
      deviceData.notification === constants.CONST_USER_VERIFIED_TRUE
    ) {
     
      // const message = {
      //   notification: {
      //     title: data.title,
      //     body: data.body,
      //   },
      //   token: deviceData.deviceToken,
      // };
      
      const message = {
        notification: {
          title: data.title,
          body: data.body,
        },
        token: deviceData.deviceToken,
        data: {
          title: data.title,
          id: objectIdString,
          type: data.type, 
          // name:data.name,
          deviceType: deviceData.deviceType, 
          icon: "ic_launcher",
          sound: "default",
        },
      };
     
      const notificationResponse = await admin.messaging().send(message);
    
      return {
        notificationData: result._id,
        notificationResponse: notificationResponse,
      };
    }

    return {
      notificationData: result._id,
      notificationResponse: null,
    };
  } catch (error) {
  
    return {
      error: "An error occurred while sending the notification.",
    };
  }
};

// Send Notification by Cron job using Firebase Admin SDK
const sendNotificationByCron = async () => {
  try {
    let data = await notificationModel.aggregate([
      {
        $match: {
          status: constants.CONST_STATUS_PENDING,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          receiverId: 1,
          notificationBody: 1,
          notificationTitle: 1,
          status: 1,
          id: 1,
          redirectionContain:1,
          userData: {
            _id: 1,
            deviceToken: 1,
            deviceType: 1,
            notification: 1,
          },
        },
      },
    ]);

    if (data.length) {
      for (let d of data) {
        try {
          if (
            d.userData.deviceType === constants.CONST_DEVICE_ANDROID ||
            d.userData.deviceType === constants.CONST_DEVICE_IOS ||
            d.userData.notification === constants.CONST_USER_VERIFIED_TRUE
          ) {
           
           let objectId = d.redirectionContain.id;
           let objectIdString = objectId.toString();
            const message = {
              notification: {
                title: d.notificationTitle,
                body: d.notificationBody,
              },
              token: d.userData.deviceToken,
              data: {
                title: d.notificationTitle,
                id: objectIdString,
                type: d.redirectionContain.type, // assuming this is the notification type
                deviceType: d.userData.deviceType, // renamed to avoid conflict
                icon: "ic_launcher",
                sound: "default",
                // name:data.name,
              },
            };

            const notificationResponse = await admin.messaging().send(message);

            await notificationModel.findOneAndUpdate(
              { _id: d._id },
              {
                pushNotificationResponse: notificationResponse,
                status: constants.CONST_STATUS_SUCCESS,
              },
              { new: true }
            );
          } else {
            await notificationModel.findOneAndUpdate(
              { _id: d._id },
              {
                pushNotificationResponse: null,
                status: constants.CONST_STATUS_SUCCESS,
              },
              { new: true }
            );
          }
        } catch (error) {
         
          return { error: error };
        }
      }
    }
  } catch (error) {
    
    return {
      error: "An error occurred while sending the notifications.",
    };
  }
};

let notification = {
  sendNotification: sendNotification,
  sendNotificationByCron: sendNotificationByCron,
};

export default notification;
