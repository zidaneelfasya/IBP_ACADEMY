<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TeamRegistrationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $registrationId = $this->route('id'); // For update scenarios

        return [
            // Team Information
            'tim_name' => [
                'required',
                'string',
                'min:3',
                'max:100',
                // Temporarily comment out unique validation for testing
                // Rule::unique('team_registrations', 'tim_name')
                //     ->where('competition_category_id', $this->competition_category_id)
                //     ->ignore($registrationId, 'id')
            ],
            'asal_universitas' => 'required|string|min:5|max:200',
            'prodi_fakultas' => 'required|string|min:3|max:200',
            'competition_category_id' => 'required|exists:competition_categories,id',

            // Leader Information
            'leader_name' => 'required|string|min:3|max:100',
            'leader_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'regex:/^[A-Za-z0-9]+$/',
                Rule::unique('team_registrations', 'leader_nim') // Updated table name
                    ->where('competition_category_id', $this->competition_category_id)
                    ->ignore($registrationId, 'id')
            ],
            'leader_email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('team_registrations', 'leader_email') // Updated table name
                    ->where('competition_category_id', $this->competition_category_id)
                    ->ignore($registrationId, 'id')
            ],
            'leader_phone' => [
                'required',
                'string',
                'min:10',
                'max:15',
                'regex:/^(\+62|62|0)[0-9]{9,13}$/'
            ],

            // Member 1 Information
            'member1_name' => 'required|string|min:3|max:100',
            'member1_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'regex:/^[A-Za-z0-9]+$/',
                'different:leader_nim',
                Rule::unique('team_registrations', 'member1_nim') // Updated table name
                    ->where('competition_category_id', $this->competition_category_id)
                    ->ignore($registrationId, 'id')
            ],
            'member1_email' => [
                'required',
                'email',
                'max:100',
                'different:leader_email',
                Rule::unique('team_registrations', 'member1_email') // Updated table name
                    ->where('competition_category_id', $this->competition_category_id)
                    ->ignore($registrationId, 'id')
            ],
            'member1_phone' => [
                'required',
                'string',
                'min:10',
                'max:15',
                'regex:/^(\+62|62|0)[0-9]{9,13}$/',
                'different:leader_phone'
            ],

            // Member 2 Information
            'member2_name' => 'required|string|min:3|max:100',
            'member2_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'regex:/^[A-Za-z0-9]+$/',
                'different:leader_nim,member1_nim',
                Rule::unique('team_registrations', 'member2_nim') // Updated table name
                    ->where('competition_category_id', $this->competition_category_id)
                    ->ignore($registrationId, 'id')
            ],
            'member2_email' => [
                'required',
                'email',
                'max:100',
                'different:leader_email,member1_email',
                Rule::unique('team_registrations', 'member2_email') // Updated table name
                    ->where('competition_category_id', $this->competition_category_id)
                    ->ignore($registrationId, 'id')
            ],
            'member2_phone' => [
                'required',
                'string',
                'min:10',
                'max:15',
                'regex:/^(\+62|62|0)[0-9]{9,13}$/',
                'different:leader_phone,member1_phone'
            ],

            // Member 3 Information
            'member3_name' => 'required|string|min:3|max:100',
            'member3_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'regex:/^[A-Za-z0-9]+$/',
                'different:leader_nim,member1_nim,member2_nim',
                Rule::unique('team_registrations', 'member3_nim') // Updated table name
                    ->where('competition_category_id', $this->competition_category_id)
                    ->ignore($registrationId, 'id')
            ],
            'member3_email' => [
                'required',
                'email',
                'max:100',
                'different:leader_email,member1_email,member2_email',
                Rule::unique('team_registrations', 'member3_email') // Updated table name
                    ->where('competition_category_id', $this->competition_category_id)
                    ->ignore($registrationId, 'id')
            ],
            'member3_phone' => [
                'required',
                'string',
                'min:10',
                'max:15',
                'regex:/^(\+62|62|0)[0-9]{9,13}$/',
                'different:leader_phone,member1_phone,member2_phone'
            ],

            // Documents
            'link_berkas' => 'required|url|max:500',
        ];
    }

    /**
     * Get custom validation messages
     */
    public function messages(): array
    {
        return [
            // Team Information Messages
            'tim_name.required' => 'Nama tim wajib diisi.',
            'tim_name.min' => 'Nama tim minimal 3 karakter.',
            'tim_name.max' => 'Nama tim maksimal 100 karakter.',
            'tim_name.unique' => 'Nama tim sudah digunakan, silakan pilih nama lain.',

            'asal_universitas.required' => 'Asal universitas wajib diisi.',
            'asal_universitas.min' => 'Asal universitas minimal 5 karakter.',
            'asal_universitas.max' => 'Asal universitas maksimal 200 karakter.',

            'prodi_fakultas.required' => 'Program studi/fakultas wajib diisi.',
            'prodi_fakultas.min' => 'Program studi/fakultas minimal 3 karakter.',
            'prodi_fakultas.max' => 'Program studi/fakultas maksimal 200 karakter.',

            // Leader Messages
            'leader_name.required' => 'Nama ketua tim wajib diisi.',
            'leader_name.min' => 'Nama ketua tim minimal 3 karakter.',
            'leader_name.max' => 'Nama ketua tim maksimal 100 karakter.',

            'leader_nim.required' => 'NIM ketua tim wajib diisi.',
            'leader_nim.min' => 'NIM ketua tim minimal 5 karakter.',
            'leader_nim.max' => 'NIM ketua tim maksimal 20 karakter.',
            'leader_nim.regex' => 'NIM ketua tim hanya boleh berisi huruf dan angka.',
            'leader_nim.unique' => 'NIM ketua tim sudah terdaftar.',

            'leader_email.required' => 'Email ketua tim wajib diisi.',
            'leader_email.email' => 'Format email ketua tim tidak valid.',
            'leader_email.unique' => 'Email ketua tim sudah terdaftar.',

            'leader_phone.required' => 'Nomor telepon ketua tim wajib diisi.',
            'leader_phone.min' => 'Nomor telepon ketua tim minimal 10 digit.',
            'leader_phone.max' => 'Nomor telepon ketua tim maksimal 15 digit.',
            'leader_phone.regex' => 'Format nomor telepon ketua tim tidak valid.',

            // Member 1 Messages
            'member1_name.required' => 'Nama anggota 1 wajib diisi.',
            'member1_nim.required' => 'NIM anggota 1 wajib diisi.',
            'member1_nim.different' => 'NIM anggota 1 tidak boleh sama dengan ketua tim.',
            'member1_nim.unique' => 'NIM anggota 1 sudah terdaftar.',
            'member1_email.required' => 'Email anggota 1 wajib diisi.',
            'member1_email.different' => 'Email anggota 1 tidak boleh sama dengan ketua tim.',
            'member1_email.unique' => 'Email anggota 1 sudah terdaftar.',
            'member1_phone.required' => 'Nomor telepon anggota 1 wajib diisi.',
            'member1_phone.different' => 'Nomor telepon anggota 1 tidak boleh sama dengan ketua tim.',

            // Member 2 Messages
            'member2_name.required' => 'Nama anggota 2 wajib diisi.',
            'member2_nim.required' => 'NIM anggota 2 wajib diisi.',
            'member2_nim.different' => 'NIM anggota 2 tidak boleh sama dengan anggota lain.',
            'member2_nim.unique' => 'NIM anggota 2 sudah terdaftar.',
            'member2_email.required' => 'Email anggota 2 wajib diisi.',
            'member2_email.different' => 'Email anggota 2 tidak boleh sama dengan anggota lain.',
            'member2_email.unique' => 'Email anggota 2 sudah terdaftar.',
            'member2_phone.required' => 'Nomor telepon anggota 2 wajib diisi.',
            'member2_phone.different' => 'Nomor telepon anggota 2 tidak boleh sama dengan anggota lain.',

            // Member 3 Messages
            'member3_name.required' => 'Nama anggota 3 wajib diisi.',
            'member3_nim.required' => 'NIM anggota 3 wajib diisi.',
            'member3_nim.different' => 'NIM anggota 3 tidak boleh sama dengan anggota lain.',
            'member3_nim.unique' => 'NIM anggota 3 sudah terdaftar.',
            'member3_email.required' => 'Email anggota 3 wajib diisi.',
            'member3_email.different' => 'Email anggota 3 tidak boleh sama dengan anggota lain.',
            'member3_email.unique' => 'Email anggota 3 sudah terdaftar.',
            'member3_phone.required' => 'Nomor telepon anggota 3 wajib diisi.',
            'member3_phone.different' => 'Nomor telepon anggota 3 tidak boleh sama dengan anggota lain.',

            // Documents Messages
            'link_berkas.required' => 'Link berkas persyaratan wajib diisi.',
            'link_berkas.url' => 'Format link berkas tidak valid.',
            'link_berkas.max' => 'Link berkas maksimal 500 karakter.',

            // Phone regex messages
            '*.phone.regex' => 'Format nomor telepon tidak valid. Gunakan format: 08xxxxxxxxxx atau +62xxxxxxxxx.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'tim_name' => 'nama tim',
            'asal_universitas' => 'asal universitas',
            'prodi_fakultas' => 'program studi/fakultas',
            'leader_name' => 'nama ketua tim',
            'leader_nim' => 'NIM ketua tim',
            'leader_email' => 'email ketua tim',
            'leader_phone' => 'nomor telepon ketua tim',
            'member1_name' => 'nama anggota 1',
            'member1_nim' => 'NIM anggota 1',
            'member1_email' => 'email anggota 1',
            'member1_phone' => 'nomor telepon anggota 1',
            'member2_name' => 'nama anggota 2',
            'member2_nim' => 'NIM anggota 2',
            'member2_email' => 'email anggota 2',
            'member2_phone' => 'nomor telepon anggota 2',
            'member3_name' => 'nama anggota 3',
            'member3_nim' => 'NIM anggota 3',
            'member3_email' => 'email anggota 3',
            'member3_phone' => 'nomor telepon anggota 3',
            'link_berkas' => 'link berkas persyaratan',
        ];
    }
}
