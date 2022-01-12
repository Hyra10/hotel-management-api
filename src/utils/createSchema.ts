import { buildSchema } from 'type-graphql';
import { RegisterResolver } from '../modules/User/Register/Register.resolver';
import { LoginResolver } from '../modules/User/Login/Login.resolver';
import { UserUtilityResolver } from '../modules/User/Utility/UserUtility.resolver';
import { ClientResolver } from '../modules/Client/Client.resolver';
import { ServiceResolver } from '../modules/Service/Service.resolver';
import {
  ServiceReservationResolver
} from '../modules/ServiceReservation/ServiceReservation.resolver';
import { ServiceStatusResolver } from '../modules/ServiceStatus/ServiceStatus.resolver';
import {
  ReservationStatusResolver
} from './../modules/ReservationStatus/ReservationStatus.resolver';
import { ReservationResolver } from '../modules/Reservation/Reservation.resolver';
import { ReservationItemResolver } from '../modules/ReservationItem/ReservationItem.resolver';
import { ReservationRoomResolver } from '../modules/ReservationRoom/Reservation.resolver';
import { RoomResolver } from '../modules/Room/Room.resolver';
import { RoomViewResolver } from '../modules/RoomView/RoomView.resolver';
import { RoomStatusResolver } from '../modules/RoomStatus/RoomStatus.resolver';
import { RoomTypeResolver } from '../modules/RoomType/RoomType.resolver';
import { BedResolver } from '../modules/Bed/Bed.resolver';
import { HotelResolver } from '../modules/Hotel/Hotel.resolver';
import { UserResolver } from '../modules/User/User.resolver';
import { UserRoleResolver } from '../modules/UserRoles/UserRoles.resolver';
import { ReportResolver } from '../modules/Report/report.resolver';
import { ForgotResolver } from '../modules/User/Forgot/forgot.resolver';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      ForgotResolver,
      UserUtilityResolver,
      ClientResolver,
      ServiceResolver,
      ServiceReservationResolver,
      ServiceStatusResolver,
      ReservationResolver,
      ReservationRoomResolver,
      ReservationStatusResolver,
      ReservationItemResolver,
      RoomResolver,
      RoomTypeResolver,
      RoomStatusResolver,
      RoomViewResolver,
      BedResolver,
      HotelResolver,
      UserResolver,
      UserRoleResolver,
      ReportResolver,
    ],
  });
