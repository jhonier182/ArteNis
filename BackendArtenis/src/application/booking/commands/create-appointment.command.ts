export class CreateAppointmentCommand {
  constructor(
    public readonly artistId: string,
    public readonly clientId: string,
    public readonly scheduledAt: Date,
    public readonly description?: string,
  ) {}
}


