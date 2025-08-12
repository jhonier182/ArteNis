export class ConfirmAppointmentCommand {
  constructor(
    public readonly appointmentId: string,
    public readonly artistId: string,
  ) {}
}


