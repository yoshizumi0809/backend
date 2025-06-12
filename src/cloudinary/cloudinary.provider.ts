import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dqyq4u6ct',
      api_key: '985126979781965',
      api_secret: 'RK6fzKAh_WQOgiFHbg-AMnCibZ0',
    });
  },
};
