import { Controller, Get, Post, Body, Param, UseGuards, Delete, Patch, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateAppointmentCommand } from '@application/booking/commands/create-appointment.command';
import { CancelAppointmentCommand } from '@application/booking/commands/cancel-appointment.command';
import { ConfirmAppointmentCommand } from '@application/booking/commands/confirm-appointment.command';
import { CompleteAppointmentCommand } from '@application/booking/commands/complete-appointment.command';
import { GetMyAppointmentsQuery } from '@application/booking/queries/get-my-appointments.query';
import { RequestQuoteCommand } from '@application/booking/commands/request-quote.command';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  
  @Get('appointments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener citas del usuario',
    description: 'Devuelve todas las citas del usuario autenticado'
  })
  async getMyAppointments(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const role = user.artistProfile ? 'artist' : 'client';
    const query = new GetMyAppointmentsQuery(user.id, role, { page, limit });
    const result = await this.queryBus.execute(query);
    return result;
  }

  @Post('appointments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Crear nueva cita',
    description: 'Agenda una nueva cita con un tatuador'
  })
  async createAppointment(
    @CurrentUser() user: any,
    @Body() appointmentData: { artistId: string; scheduledAt: Date; description?: string },
  ) {
    const command = new CreateAppointmentCommand(
      appointmentData.artistId,
      user.id,
      new Date(appointmentData.scheduledAt),
      appointmentData.description,
    );
    const appt = await this.commandBus.execute(command);
    return { message: 'Cita creada exitosamente', data: appt };
  }

  @Patch('appointments/:id/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar cita', description: 'Confirma una cita (solo artista)' })
  async confirmAppointment(@CurrentUser() user: any, @Param('id') id: string) {
    const command = new ConfirmAppointmentCommand(id, user.id);
    await this.commandBus.execute(command);
    return { message: 'Cita confirmada' };
  }

  @Patch('appointments/:id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Completar cita', description: 'Marca una cita como completada (solo artista)' })
  async completeAppointment(@CurrentUser() user: any, @Param('id') id: string) {
    const command = new CompleteAppointmentCommand(id, user.id);
    await this.commandBus.execute(command);
    return { message: 'Cita completada' };
  }

  @Delete('appointments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancelar cita', description: 'Cancela una cita (cliente o artista)' })
  async cancelAppointment(@CurrentUser() user: any, @Param('id') id: string) {
    const command = new CancelAppointmentCommand(id, user.id);
    await this.commandBus.execute(command);
  }

  @Post('quotes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Solicitar cotización',
    description: 'Solicita una cotización a un tatuador'
  })
  async requestQuote(
    @CurrentUser() user: any,
    @Body() quoteData: { artistId: string; description: string },
  ) {
    const command = new RequestQuoteCommand(quoteData.artistId, user.id, quoteData.description);
    const quote = await this.commandBus.execute(command);
    return { message: 'Cotización solicitada exitosamente', data: quote };
  }
}
