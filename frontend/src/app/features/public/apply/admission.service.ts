import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';

export interface AdmissionApplication {
  id: string;
  template: string;
  appliedClass: string;
  studentFullName: string;
  fatherFullName: string;
  fatherCNIC: string;
  dateOfBirth: string;
  dateOfBirthInWords: string;
  gender: string;
  fatherOccupation: string;
  domicile: string;
  nationality: string;
  residentialAddress: string;
  primaryContact: string;
  alternateContact: string | null;
  previousClass: string | null;
  previousSchoolName: string | null;
  leavingDate: string | null;
  photoUrl: string;
  cnicCopyUrl: string | null;
  domicileCopyUrl: string | null;
  schoolLeavingCertUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionApplicationList {
  data: AdmissionApplication[];
  total: number;
}

export interface UpdateAdmissionStatusDto {
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private readonly http = inject(HttpClient);

  submitApplication(formData: FormData): Observable<AdmissionApplication> {
    return this.http.post<AdmissionApplication>(
      `${API_BASE_URL}/admissions/applications`,
      formData,
      { withCredentials: true },
    );
  }

  getApplications(status?: string): Observable<AdmissionApplicationList> {
    const params: Record<string, string> = {};
    if (status) {
      params['status'] = status;
    }
    return this.http.get<AdmissionApplicationList>(
      `${API_BASE_URL}/admissions/admin/applications`,
      { params, withCredentials: true },
    );
  }

  getApplication(id: string): Observable<AdmissionApplication> {
    return this.http.get<AdmissionApplication>(
      `${API_BASE_URL}/admissions/admin/applications/${id}`,
      { withCredentials: true },
    );
  }

  updateStatus(id: string, dto: UpdateAdmissionStatusDto): Observable<AdmissionApplication> {
    return this.http.patch<AdmissionApplication>(
      `${API_BASE_URL}/admissions/admin/applications/${id}/status`,
      dto,
      { withCredentials: true },
    );
  }
}
