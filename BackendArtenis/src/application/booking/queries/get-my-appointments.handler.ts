import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetMyAppointmentsQuery } from './get-my-appointments.query';
import { AppointmentRepository } from '@domain/booking/repositories/appointment.repository';

@QueryHandler(GetMyAppointmentsQuery)
export class GetMyAppointmentsHandler implements IQueryHandler<GetMyAppointmentsQuery> {
  constructor(@Inject('AppointmentRepository') private readonly appointmentRepo: AppointmentRepository) {}

  async execute(query: GetMyAppointmentsQuery) {
    const { userId, role, pagination } = query;
    const { page = 1, limit = 20 } = pagination;

    const result = role === 'artist'
      ? await this.appointmentRepo.findByArtist(userId, { page, limit })
      : await this.appointmentRepo.findByClient(userId, { page, limit });

    const totalPages = Math.ceil(result.total / limit);
    return { ...result, page, limit, totalPages };
  }
}


