import { logger } from '@/lib/logger';
import { config } from '@/lib/config';
import { handleHttpResponse } from '@/lib/utils/api-response-handler';
import { libraryApiClient } from './client';

// 列表项接口
export interface MaterialSquareItem {
  id: number;
  createUserString: string | null;
  createTime: string;
  title: string;
  mediaType: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  previewUrl?: string; // 预览图片URL
  publisher: string;
  publishTime: string;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  commentCount: number;
  shareCount: number;
}

// 详情接口
export interface MaterialSquareDetail extends MaterialSquareItem {
  purpose?: string;
  targetAudience?: string;
  aiTech?: string;
  status?: number;
}

// 列表响应接口
export interface MaterialSquareListResponse {
  success: boolean;
  code: number;
  msg: string;
  data: {
    list: MaterialSquareItem[];
    total: number;
  };
  timestamp?: number;
}

// 详情响应接口
export interface MaterialSquareDetailResponse {
  success: boolean;
  code: number;
  msg: string;
  data: MaterialSquareDetail;
  timestamp?: number;
}

// 列表查询参数
export interface MaterialSquareListParams {
  title?: string;
  category?: string;
  mediaType?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// Voice 列表项接口
export interface MaterialSquareAudioItem {
  id: number;
  createUserString: string | null;
  createTime: string;
  disabled: boolean;
  title: string;
  publisher: string;
  duration: string;
  style: string;
  audioUrl: string;
  thumbnail: string;
  plays: number;
  likes: number;
  publishTime: string;
  status: number;
}

// Voice 详情接口
export interface MaterialSquareAudioDetail extends MaterialSquareAudioItem {
  timestamp?: number;
}

// Voice 列表响应接口
export interface MaterialSquareAudioListResponse {
  success: boolean;
  code: number;
  msg: string;
  data: {
    list: MaterialSquareAudioItem[];
    total: number;
    timestamp?: number;
  };
  timestamp?: number;
}

// Voice 详情响应接口
export interface MaterialSquareAudioDetailResponse {
  success: boolean;
  code: number;
  msg: string;
  data: MaterialSquareAudioDetail;
  timestamp?: number;
}

// Voice 列表查询参数
export interface MaterialSquareAudioListParams {
  title?: string;
  style?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// Model 列表项接口
export interface MaterialSquareModelItem {
  id: number;
  createUserString: string | null;
  createTime: string;
  disabled: boolean;
  name: string;
  style: string;
  gender: string;
  ethnicity: string;
  thumbnail: string;
  downloads: number;
  likes: number;
  publishTime: string;
  status: number;
}

// Model 详情接口
export interface MaterialSquareModelDetail extends MaterialSquareModelItem {
  timestamp?: number;
}

// Model 列表响应接口
export interface MaterialSquareModelListResponse {
  success: boolean;
  code: number;
  msg: string;
  data: {
    list: MaterialSquareModelItem[];
    total: number;
    timestamp?: number;
  };
  timestamp?: number;
}

// Model 详情响应接口
export interface MaterialSquareModelDetailResponse {
  success: boolean;
  code: number;
  msg: string;
  data: MaterialSquareModelDetail;
  timestamp?: number;
}

// Model 列表查询参数
export interface MaterialSquareModelListParams {
  name?: string;
  style?: string;
  gender?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * 获取素材广场分页列表
 */
export async function fetchMaterialSquareList(
  params: MaterialSquareListParams = {}
): Promise<MaterialSquareListResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    // 只有当参数存在且不为空时才添加到查询参数中
    if (params.title && params.title.trim()) {
      queryParams.append('title', params.title.trim());
    }
    if (params.category && params.category.trim() && params.category !== 'all') {
      queryParams.append('category', params.category.trim());
    }
    if (params.mediaType && params.mediaType.trim()) {
      queryParams.append('mediaType', params.mediaType.trim());
    }
    if (params.status && params.status.trim()) {
      queryParams.append('status', params.status.trim());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }
    if (params.sort && params.sort.trim()) {
      queryParams.append('sort', params.sort.trim());
    }

    const endpoint = `/api/app/material-square/page${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    logger.info('Fetching material square list', { endpoint, params });

    const apiData = await libraryApiClient.get<{ list: MaterialSquareItem[]; total: number }>(endpoint, {
      contentType: 'application/x-www-form-urlencoded',
      needAuth: true,
    });
    
    const data: MaterialSquareListResponse = {
      ...apiData,
      data: apiData.data!,
    };

    logger.info('Material square list fetched successfully', { count: data.data.list.length });
    return data;
  } catch (error) {
    logger.error('Error fetching material square list', error);
    throw error;
  }
}

/**
 * 获取素材广场详情
 */
export async function fetchMaterialSquareDetail(id: number): Promise<MaterialSquareDetailResponse> {
  try {
    const endpoint = `/api/app/material-square/${id}`;
    
    logger.info('Fetching material square detail', { endpoint, id });

    const apiData = await libraryApiClient.get<MaterialSquareDetail>(endpoint, {
      contentType: 'application/x-www-form-urlencoded',
      needAuth: true,
    });
    
    const data: MaterialSquareDetailResponse = {
      ...apiData,
      data: apiData.data!,
    };

    logger.info('Material square detail fetched successfully', { id });
    return data;
  } catch (error) {
    logger.error('Error fetching material square detail', error);
    throw error;
  }
}

/**
 * 获取素材广场音频列表
 */
export async function fetchMaterialSquareAudioList(
  params: MaterialSquareAudioListParams = {}
): Promise<MaterialSquareAudioListResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.title && params.title.trim()) {
      queryParams.append('title', params.title.trim());
    }
    if (params.style && params.style.trim()) {
      queryParams.append('style', params.style.trim());
    }
    if (params.status && params.status.trim()) {
      queryParams.append('status', params.status.trim());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }
    if (params.sort && params.sort.trim()) {
      queryParams.append('sort', params.sort.trim());
    }

    const endpoint = `/api/app/material-square/audio${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    logger.info('Fetching material square audio list', { endpoint, params });

    const apiData = await libraryApiClient.get<{ list: MaterialSquareAudioItem[]; total: number }>(endpoint, {
      contentType: 'application/x-www-form-urlencoded',
      needAuth: true,
    });
    
    const data: MaterialSquareAudioListResponse = {
      ...apiData,
      data: apiData.data!,
    };

    logger.info('Material square audio list fetched successfully', { count: data.data.list.length });
    return data;
  } catch (error) {
    logger.error('Error fetching material square audio list', error);
    throw error;
  }
}

/**
 * 获取素材广场音频详情
 */
export async function fetchMaterialSquareAudioDetail(id: number): Promise<MaterialSquareAudioDetailResponse> {
  try {
    const endpoint = `/api/app/material-square/audio/${id}`;
    
    logger.info('Fetching material square audio detail', { endpoint, id });

    const apiData = await libraryApiClient.get<MaterialSquareAudioDetail>(endpoint, {
      contentType: 'application/x-www-form-urlencoded',
      needAuth: true,
    });
    
    const data: MaterialSquareAudioDetailResponse = {
      ...apiData,
      data: apiData.data!,
    };

    logger.info('Material square audio detail fetched successfully', { id });
    return data;
  } catch (error) {
    logger.error('Error fetching material square audio detail', error);
    throw error;
  }
}

/**
 * 获取素材广场模特列表
 */
export async function fetchMaterialSquareModelList(
  params: MaterialSquareModelListParams = {}
): Promise<MaterialSquareModelListResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.name && params.name.trim()) {
      queryParams.append('name', params.name.trim());
    }
    if (params.style && params.style.trim()) {
      queryParams.append('style', params.style.trim());
    }
    if (params.gender && params.gender.trim()) {
      queryParams.append('gender', params.gender.trim());
    }
    if (params.status && params.status.trim()) {
      queryParams.append('status', params.status.trim());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size) {
      queryParams.append('size', params.size.toString());
    }
    if (params.sort && params.sort.trim()) {
      queryParams.append('sort', params.sort.trim());
    }

    const endpoint = `/api/app/material-square/model${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    logger.info('Fetching material square model list', { endpoint, params });

    const apiData = await libraryApiClient.get<{ list: MaterialSquareModelItem[]; total: number }>(endpoint, {
      contentType: 'application/x-www-form-urlencoded',
      needAuth: true,
    });
    
    const data: MaterialSquareModelListResponse = {
      ...apiData,
      data: apiData.data!,
    };

    logger.info('Material square model list fetched successfully', { count: data.data.list.length });
    return data;
  } catch (error) {
    logger.error('Error fetching material square model list', error);
    throw error;
  }
}

/**
 * 获取素材广场模特详情
 */
export async function fetchMaterialSquareModelDetail(id: number): Promise<MaterialSquareModelDetailResponse> {
  try {
    const endpoint = `/api/app/material-square/model/${id}`;
    
    logger.info('Fetching material square model detail', { endpoint, id });

    const apiData = await libraryApiClient.get<MaterialSquareModelDetail>(endpoint, {
      contentType: 'application/x-www-form-urlencoded',
      needAuth: true,
    });
    
    const data: MaterialSquareModelDetailResponse = {
      ...apiData,
      data: apiData.data!,
    };

    logger.info('Material square model detail fetched successfully', { id });
    return data;
  } catch (error) {
    logger.error('Error fetching material square model detail', error);
    throw error;
  }
}
