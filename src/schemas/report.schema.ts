import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

export type ReportType =
  | 'pothole'
  | 'accident'
  | 'traffic'
  | 'construction'
  | 'other';
export type AlertSeverity = 'low' | 'medium' | 'high';
export type ReportStatus = 'pending' | 'accepted' | 'in_progress' | 'completed';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

@Schema()
export class Report {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ['pothole', 'accident', 'traffic', 'construction', 'other'],
  })
  type: ReportType;

  @Prop({ required: true, enum: ['low', 'medium', 'high'] })
  severity: AlertSeverity;

  @Prop({ required: true, type: Object })
  location: Location;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true })
  reportedBy: string;

  @Prop({ default: Date.now })
  reportedAt: Date;

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop({ default: false })
  resolved: boolean;

  @Prop({
    default: 'pending',
    enum: ['pending', 'accepted', 'in_progress', 'completed'],
  })
  status: ReportStatus;

  @Prop()
  adminNotes?: string;

  @Prop()
  verifiedBy?: string;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
