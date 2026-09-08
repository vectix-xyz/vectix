import { INestApplication } from '@nestjs/common';
import { EXCLUDED_ROUTES } from '@repo/common/constants';

export function getExcludedRoutesConfig(app: INestApplication) {
  EXCLUDED_ROUTES.forEach(route => {
    app.use(route, (req: any, res: any, next: any) => next());
  });
}
