import mongoose from "mongoose";

const behavioralMetricsSchema = new mongoose.Schema({
  discipline: { type: Number, min: 0, max: 5, required: true },
  punctuality: { type: Number, min: 0, max: 5, required: true },
  teamwork: { type: Number, min: 0, max: 5, required: true },
  communication: { type: Number, min: 0, max: 5, required: true },
  problem_solving: { type: Number, min: 0, max: 5, required: true },
});

const performanceMetricSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  quiz_score: { type: Number, min:0 , max: 10 , required: true }, // Quiz score field
  behavioral_metrics: { type: behavioralMetricsSchema, required: true }, // Behavioral metrics field
  date: { type: Date, default: Date.now },
  comments: String,
});

export default mongoose.model('PerformanceMetric', performanceMetricSchema);
