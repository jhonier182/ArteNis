import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException, Inject } from '@nestjs/common';

import { ConfirmAppointmentCommand } from './confirm-appointment.command';
import { AppointmentRepository } from '@domain/booking/repositories/appointment.repository';
import { AppointmentStatus } from '@infrastructure/database/mysql/entities/appointment.entity';

@CommandHandler(ConfirmAppointmentCommand)
export class ConfirmAppointmentHandler implements ICommandHandler<ConfirmAppointmentCommand> {
  constructor(@Inject('AppointmentRepository') private readonly appointmentRepo: AppointmentRepository) {}

  async execute(command: ConfirmAppointmentCommand): Promise<void> {
    const { appointmentId, artistId } = command;
    const appt = await this.appointmentRepo.findById(appointmentId);
    if (!appt) throw new NotFoundException('Cita no encontrada');
    if (appt.artistId !== artistId) throw new ForbiddenException('Solo el artista puede confirmar la cita');
    await this.appointmentRepo.updateStatus(appointmentId, AppointmentStatus.CONFIRMED);
  }
}


