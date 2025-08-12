import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException, Inject } from '@nestjs/common';

import { CancelAppointmentCommand } from './cancel-appointment.command';
import { AppointmentRepository } from '@domain/booking/repositories/appointment.repository';
import { AppointmentStatus } from '@infrastructure/database/mysql/entities/appointment.entity';

@CommandHandler(CancelAppointmentCommand)
export class CancelAppointmentHandler implements ICommandHandler<CancelAppointmentCommand> {
  constructor(@Inject('AppointmentRepository') private readonly appointmentRepo: AppointmentRepository) {}

  async execute(command: CancelAppointmentCommand): Promise<void> {
    const { appointmentId, requesterId } = command;
    const appt = await this.appointmentRepo.findById(appointmentId);
    if (!appt) throw new NotFoundException('Cita no encontrada');

    // Solo cliente o artista asociado puede cancelar
    if (appt.clientId !== requesterId && appt.artistId !== requesterId) {
      throw new ForbiddenException('No tienes permisos para cancelar esta cita');
    }

    await this.appointmentRepo.updateStatus(appointmentId, AppointmentStatus.CANCELLED);
  }
}


