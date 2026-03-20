/**
 * 模型API服务
 */

import { config } from "../config";
import { logger } from "../logger";
import { handleError } from "../utils/error-handler";
import { modelsApiClient } from "./client";
import { createAuthHeaders } from "../utils/api-request";

/**
 * 供应商信息
 */
export interface Vendor {
  id: number;
  name: string;
  icon: string;
}

/**
 * 模型数据
 */
export interface ModelData {
  model_name: string;
  vendor_id?: number;
  quota_type: number; // 0: 按量计费, 1: 按次计费
  model_ratio: number;
  model_price: number;
  owner_by: string;
  completion_ratio: number;
  enable_groups: string[];
  supported_endpoint_types: string[];
}

/**
 * 定价API响应
 */
export interface PricingResponse {
  auto_groups: string[];
  data: ModelData[];
  group_ratio: Record<string, number>;
  success: boolean;
  supported_endpoint: Record<string, { path: string; method: string }>;
  usable_group: Record<string, string>;
  vendors: Vendor[];
}

/**
 * 获取模型定价数据
 * 注意：此 API 的响应格式与标准 ApiResponse 不同，直接返回 PricingResponse
 */
export async function fetchPricingData(): Promise<PricingResponse> {
  const apiUrl = `${config.api.modelsBaseUrl}/api/pricing`;

  try {
    // 使用 createAuthHeaders 确保包含 Accept-Language 头
    const requestConfig = createAuthHeaders({
      method: 'GET',
      contentType: 'application/json',
      needAuth: false, // 定价数据不需要认证
    });

    const response = await fetch(apiUrl, requestConfig);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PricingResponse = await response.json();

    if (!data.success) {
      throw new Error("API returned unsuccessful response");
    }

    return data;
  } catch (error) {
    logger.error("Failed to fetch pricing data", error as Error);
    throw handleError(error, { context: "fetchPricingData" });
  }
}

