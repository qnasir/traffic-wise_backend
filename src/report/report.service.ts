import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Report,
  ReportDocument,
  ReportType,
  AlertSeverity,
  ReportStatus,
  Location,
} from 'src/schemas/report.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async create(report: Report): Promise<Report> {
    const createdReport = new this.reportModel(report);
    return createdReport.save();
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async findOne(id: string): Promise<Report | undefined> {
    const report = await this.reportModel.findById(id).exec();
    return report || undefined;
  }

  async remove(id: string): Promise<Report> {
    const deletedReport = await this.reportModel.findByIdAndDelete(id).exec();
    if (!deletedReport) {
      throw new Error(`Report with id ${id} not found`);
    }
    return deletedReport;
  }

  async upvote(id: string): Promise<Report> {
    const updatedReport = await this.reportModel
      .findByIdAndUpdate(
        id,
        { $inc: { upvotes: 1 }, lastUpdated: new Date() },
        { new: true },
      )
      .exec();
    if (!updatedReport) {
      throw new Error(`Report with id ${id} not found`);
    }
    return updatedReport;
  }

  async downvote(id: string): Promise<Report> {
    const updatedReport = await this.reportModel
      .findByIdAndUpdate(
        id,
        { $inc: { downvotes: 1 }, lastUpdated: new Date() },
        { new: true },
      )
      .exec();
    if (!updatedReport) {
      throw new Error(`Report with id ${id} not found`);
    }
    return updatedReport;
  }

  async markResolved(id: string): Promise<Report> {
    const updatedReport = await this.reportModel
      .findByIdAndUpdate(
        id,
        { resolved: true, status: 'completed', lastUpdated: new Date() },
        { new: true },
      )
      .exec();
    if (!updatedReport) {
      throw new Error(`Report with id ${id} not found`);
    }
    return updatedReport;
  }

  async updateStatus(id: string, status: ReportStatus): Promise<Report> {
    const updatedReport = await this.reportModel
      .findByIdAndUpdate(id, { status, lastUpdated: new Date() }, { new: true })
      .exec();
    if (!updatedReport) {
      throw new Error(`Report with id ${id} not found`);
    }
    return updatedReport;
  }

  async addAdminNote(id: string, note: string): Promise<Report> {
    const updatedReport = await this.reportModel
      .findByIdAndUpdate(
        id,
        { adminNotes: note, lastUpdated: new Date() },
        { new: true },
      )
      .exec();
    if (!updatedReport) {
      throw new Error(`Report with id ${id} not found`);
    }
    return updatedReport;
  }

  async verify(id: string, adminId: string): Promise<Report> {
    const updatedReport = await this.reportModel
      .findByIdAndUpdate(
        id,
        { verifiedBy: adminId, status: 'accepted', lastUpdated: new Date() },
        { new: true },
      )
      .exec();

    if (!updatedReport) {
      throw new Error(`Report with id ${id} not found`);
    }

    return updatedReport;
  }

  async getNearby(location: Location, radiusKm: number): Promise<Report[]> {
    const reports = await this.reportModel.find().exec();
    return reports.filter((report) => {
      const distance = this.getDistanceFromLatLonInKm(
        location.lat,
        location.lng,
        report.location.lat,
        report.location.lng,
      );
      return distance <= radiusKm;
    });
  }

  async getByType(type: ReportType): Promise<Report[]> {
    return this.reportModel.find({ type }).exec();
  }

  async getBySeverity(severity: AlertSeverity): Promise<Report[]> {
    return this.reportModel.find({ severity }).exec();
  }

  async getByStatus(status: ReportStatus): Promise<Report[]> {
    return this.reportModel.find({ status }).exec();
  }

  private getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
