import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Klucz metadanych do przechowywania wymaganych ról
export const RolesKey = 'roles';

// Dekorator do oznaczania ról wymaganych do dostępu
export const Roles = (...roles: string[]) => SetMetadata(RolesKey, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Pobieramy wymagane role z metadanych endpointu lub kontrolera
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(RolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jeśli nie ma wymagań co do ról, pozwalamy na dostęp
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Brak użytkownika w request — odrzucamy
    if (!user) {
      throw new ForbiddenException('Nieautoryzowany dostęp');
    }

    // Sprawdzamy, czy rola użytkownika jest jedną z wymaganych
    if (requiredRoles.includes(user.role)) {
      return true;
    }

    // Brak uprawnień
    throw new ForbiddenException('Brak dostępu - wymagana odpowiednia rola');
  }
}
