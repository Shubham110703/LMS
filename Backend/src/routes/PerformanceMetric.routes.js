import express from "express";
const router = express.Router();
import {
	GetAllPerformanceMetrics,
	GetAllPerformanceMetricById,
	CreatePerformanceMetric,
	GetAllPerformanceMetricbyEmp
} from "../controllers/PerformanceMetric.controllers.js";

router.get('/', GetAllPerformanceMetrics);
router.get('/this', GetAllPerformanceMetricbyEmp);
router.get("/:employeeID", GetAllPerformanceMetricById);
router.post('/',CreatePerformanceMetric);
// Add routes for update and delete

export default router;
