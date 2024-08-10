import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';

const localeArDz:any = localeAr;
localeArDz[5][1] = 'جانفي';
localeArDz[5][2] = 'فيفري';
localeArDz[5][3] = 'مارس';
localeArDz[5][4] = 'أفريل';
localeArDz[5][5] = 'ماي';
localeArDz[5][6] = 'جوان';
localeArDz[5][7] = 'جويلية';
localeArDz[5][8] = 'أوت';
localeArDz[5][9] = 'سبتمبر';
localeArDz[5][10] = 'أكتوبر';
localeArDz[5][11] = 'نوفمبر';
localeArDz[5][12] = 'ديسمبر';

registerLocaleData(localeArDz, 'ar-DZ');
