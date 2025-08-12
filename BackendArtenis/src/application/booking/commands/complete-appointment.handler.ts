import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException, Inject } from '@nestjs/common';

import { CompleteAppointmentCommand } from './complete-appointment.command';
import { AppointmentRepository } from '@domain/booking/repositories/appointment.repository';
import { AppointmentStatus } from '@infrastructure/database/mysql/entities/appointment.entity';

@CommandHandler(CompleteAppointmentCommand)
export class CompleteAppointmentHandler implements ICommandHandler<CompleteAppointmentCommand> {
  constructor(@Inject('AppointmentRepository') private readonly appointmentRepo: AppointmentRepository) {}

  async execute(command: CompleteAppointmentCommand): Promise<void> {
    const { appointmentId, artistId } = command;
    const appt = await this.appointmentRepo.findById(appointmentId);
    if (!appt) throw new NotFoundException('Cita no encontrada');
    if (appt.artistId !== artistId) throw new ForbiddenException('Solo el artista puede completar la cita');
    await this.appointmentRepo.updateStatus(appointmentId, AppointmentStatus.COMPLETED);
  }
}


