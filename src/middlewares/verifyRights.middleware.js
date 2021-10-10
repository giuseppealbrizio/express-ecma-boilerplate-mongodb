import { roleRights } from '../config/roles.config';
import { ApplicationError } from '../helpers/errors.helper';

export const verifyRights =
  (...requiredRights) =>
  (req, res, next) => {
    if (requiredRights?.length) {
      const userRights = roleRights.get(req.user?.role);

      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight),
      );

      if (!hasRequiredRights && req.params.userId !== req.user.id) {
        throw new ApplicationError(
          401,
          'You are not authorized to use this endpoint',
        );
      }
    }
    next();
  };
