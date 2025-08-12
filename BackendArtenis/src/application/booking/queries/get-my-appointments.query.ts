export class GetMyAppointmentsQuery {
  constructor(
    public readonly userId: string,
    public readonly role: 'artist' | 'client',
    public readonly pagination: { page?: number; limit?: number } = { page: 1, limit: 20 },
  ) {}
}


