export class CompleteAppointmentCommand {
  constructor(
    public readonly appointmentId: string,
    public readonly artistId: string,
  ) {}
}


