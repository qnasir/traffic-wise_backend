import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import {
  AlertSeverity,
  ReportStatus,
  ReportType,
  Report,
  Location,
} from 'src/schemas/report.schema';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(@Body() report: Report): Promise<Report> {
    return this.reportService.create(report);
  }

  @Get()
  async findAll(): Promise<Report[]> {
    return this.reportService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Report> {
    const report = await this.reportService.findOne(id);
    if (!report) {
      throw new Error(`Report with id ${id} not found`);
    }
    return report;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Report> {
    return this.reportService.remove(id);
  }

  @Put(':id/upvote')
  async upvote(@Param('id') id: string): Promise<Report> {
    return this.reportService.upvote(id);
  }

  @Put(':id/downvote')
  async downvote(@Param('id') id: string): Promise<Report> {
    return this.reportService.downvote(id);
  }

  @Put(':id/resolve')
  async markResolved(@Param('id') id: string): Promise<Report> {
    return this.reportService.markResolved(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ReportStatus,
  ): Promise<Report> {
    return this.reportService.updateStatus(id, status);
  }

  @Put(':id/admin-note')
  async addAdminNote(
    @Param('id') id: string,
    @Body('note') note: string,
  ): Promise<Report> {
    return this.reportService.addAdminNote(id, note);
  }

  @Put(':id/verify')
  async verify(
    @Param('id') id: string,
    @Body('adminId') adminId: string,
  ): Promise<Report> {
    return this.reportService.verify(id, adminId);
  }

  @Get('nearby')
  async getNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number,
  ): Promise<Report[]> {
    const location: Location = { lat, lng };
    return this.reportService.getNearby(location, radius);
  }

  @Get('type/:type')
  async getByType(@Param('type') type: ReportType): Promise<Report[]> {
    return this.reportService.getByType(type);
  }

  @Get('severity/:severity')
  async getBySeverity(
    @Param('severity') severity: AlertSeverity,
  ): Promise<Report[]> {
    return this.reportService.getBySeverity(severity);
  }

  @Get('status/:status')
  async getByStatus(@Param('status') status: ReportStatus): Promise<Report[]> {
    return this.reportService.getByStatus(status);
  }

  @Get('stats')
  async getReportStats(): Promise<{
    totalReports: number;
    resolvedReports: number;
    byType: Record<ReportType, number>;
    byStatus: Record<ReportStatus, number>;
    bySeverity: Record<AlertSeverity, number>;
  }> {
    const reports = await this.reportService.findAll();

    const totalReports = reports.length;
    const resolvedReports = reports.filter((report) => report.resolved).length;

    const byType = reports.reduce(
      (acc, report) => {
        acc[report.type] = (acc[report.type] || 0) + 1;
        return acc;
      },
      {} as Record<ReportType, number>,
    );

    const byStatus = reports.reduce(
      (acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      },
      {} as Record<ReportStatus, number>,
    );

    const bySeverity = reports.reduce(
      (acc, report) => {
        acc[report.severity] = (acc[report.severity] || 0) + 1;
        return acc;
      },
      {} as Record<AlertSeverity, number>,
    );

    return {
      totalReports,
      resolvedReports,
      byType,
      byStatus,
      bySeverity,
    };
  }
}
