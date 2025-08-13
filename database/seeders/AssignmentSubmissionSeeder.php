<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\TeamRegistration;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Faker\Factory as Faker;

class AssignmentSubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Get all assignments
        $assignments = Assignment::with('competitionStage')->get();
        if ($assignments->isEmpty()) {
            $this->command->error('No assignments found. Please run AssignmentSeeder first.');
            return;
        }

        // Get approved teams (teams that have been verified)
        $teams = TeamRegistration::where('status', 'approved')->get();
        if ($teams->isEmpty()) {
            // If no approved teams, get any teams for demo purposes
            $teams = TeamRegistration::take(20)->get(); // Increased from 10 to 20
            $this->command->warn('No approved teams found, using any available teams for demo.');
        }

        // Get admin users who can grade submissions
        $admins = User::where('role', 'admin')->get();

        $submissionTemplates = [
            // Registration stage submissions
            'Validasi Berkas Pendaftaran' => [
                'links' => [
                    'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing',
                    'https://drive.google.com/drive/folders/ABC123XYZ789/berkas-pendaftaran',
                    'https://www.dropbox.com/s/xyz123/berkas-pendaftaran.zip',
                    'https://onedrive.live.com/redir?resid=ABCD1234567890',
                ],
                'notes' => [
                    'Berkas lengkap sudah diupload sesuai ketentuan. Mohon untuk direview.',
                    'Semua dokumen pendaftaran telah dilengkapi dalam format PDF.',
                    'Upload berkas pendaftaran tim kami. Terima kasih.',
                    'Berkas pendaftaran lengkap dengan surat pernyataan dan identitas anggota.',
                ],
                'feedback' => [
                    'Berkas lengkap dan sesuai format. Approved.',
                    'Beberapa dokumen perlu diperjelas. Silakan upload ulang dokumen yang lebih jelas.',
                    'Berkas diterima. Pastikan semua anggota tim terdaftar dengan benar.',
                ]
            ],

            // Preliminary submissions
            'Proposal Inovasi Teknologi' => [
                'links' => [
                    'https://drive.google.com/file/d/proposal_inovasi_team_alpha.pdf',
                    'https://www.dropbox.com/s/abc123/proposal-teknologi-terbaru.pdf',
                    'https://drive.google.com/file/d/innovation_proposal_v2.pdf',
                    'https://onedrive.live.com/download?resid=proposal_final.pdf',
                ],
                'notes' => [
                    'Proposal inovasi aplikasi AI untuk optimasi traffic management di kota besar. Solusi ini menggunakan machine learning untuk prediksi dan pengaturan lalu lintas real-time.',
                    'Mengajukan inovasi platform e-learning adaptif yang menggunakan algoritma personalisasi untuk meningkatkan efektivitas pembelajaran online.',
                    'Proposal pengembangan sistem IoT untuk smart farming yang dapat memantau kondisi tanaman dan otomatis mengatur irigasi.',
                    'Inovasi aplikasi mobile untuk membantu UMKM dalam digitalisasi bisnis dan akses ke pasar yang lebih luas.',
                ],
                'feedback' => [
                    'Proposal sangat menarik dengan solusi yang inovatif. Metodologi jelas dan timeline realistis.',
                    'Ide bagus, namun perlu elaborasi lebih detail pada aspek teknis implementasi.',
                    'Proposal solid dengan analisis masalah yang mendalam. Lanjut ke tahap berikutnya.',
                    'Konsep menarik tapi perlu penyesuaian pada target market dan go-to-market strategy.',
                ]
            ],

            'Video Pitch Ide' => [
                'links' => [
                    'https://youtu.be/dQw4w9WgXcQ?si=abc123',
                    'https://drive.google.com/file/d/video_pitch_team_innovation.mp4',
                    'https://www.youtube.com/watch?v=ABC123DEF456',
                    'https://vimeo.com/123456789/pitch-video',
                ],
                'notes' => [
                    'Video pitch yang menjelaskan solusi AI traffic management dengan demo interface dan simulasi hasil.',
                    'Presentasi platform e-learning adaptif dengan showcase fitur personalisasi dan dashboard analytics.',
                    'Demo konsep IoT smart farming dengan prototype sensor dan monitoring system.',
                    'Pitch aplikasi digitalisasi UMKM dengan case study dan testimonial dari pilot project.',
                ],
                'feedback' => [
                    'Video sangat engaging dan menjelaskan konsep dengan baik. Presentasi tim juga profesional.',
                    'Penjelasan jelas tapi durasi sedikit melebihi batas. Overall good job!',
                    'Excellent pitch! Demo prototype sangat membantu visualisasi solusi.',
                    'Good presentation skills, namun perlu highlight lebih pada unique value proposition.',
                ]
            ],

            // Semifinal submissions
            'Prototype Development' => [
                'links' => [
                    'https://github.com/team-alpha/traffic-ai-prototype',
                    'https://github.com/innovation-squad/elearning-adaptive',
                    'https://github.com/smart-farmers/iot-monitoring',
                    'https://github.com/umkm-digital/business-platform',
                ],
                'notes' => [
                    'Prototype aplikasi traffic management dengan algoritma machine learning untuk optimasi real-time. Sudah dapat melakukan prediksi traffic dengan akurasi 85%.',
                    'MVP platform e-learning dengan fitur adaptive learning dan analytics dashboard. Telah diuji dengan 50 pengguna beta.',
                    'Prototype sistem IoT dengan sensor untuk monitoring kelembaban, pH tanah, dan cuaca. Web dashboard untuk monitoring real-time.',
                    'Platform digitalisasi UMKM dengan fitur katalog produk, payment gateway, dan inventory management. Telah diintegrasikan dengan marketplace.',
                ],
                'feedback' => [
                    'Prototype sangat impressive! Algoritma ML bekerja dengan baik dan UI/UX intuitif.',
                    'Good progress pada pengembangan fitur adaptive learning. Perlu improvement pada response time.',
                    'Excellent work pada integrasi hardware-software. Dashboard sangat user-friendly.',
                    'Platform sudah cukup matang untuk pilot testing. Payment integration berjalan smooth.',
                ]
            ],

            'Business Model Canvas' => [
                'links' => [
                    'https://drive.google.com/file/d/business_model_canvas_traffic_ai.pdf',
                    'https://www.dropbox.com/s/canvas_elearning_platform.pdf',
                    'https://drive.google.com/file/d/smart_farming_business_model.pdf',
                    'https://onedrive.live.com/download?resid=umkm_digital_canvas.pdf',
                ],
                'notes' => [
                    'Business model untuk solusi traffic management B2G dengan revenue stream dari lisensi software dan maintenance. Target pasar pemerintah kota besar.',
                    'Model bisnis platform e-learning B2B2C dengan subscription-based untuk institusi pendidikan dan freemium untuk individual learners.',
                    'Business model IoT smart farming dengan hardware leasing dan SaaS monitoring. Target petani modern dan agribusiness.',
                    'Platform UMKM dengan commission-based revenue dari transaksi dan subscription untuk premium features.',
                ],
                'feedback' => [
                    'Business model realistic dengan clear value proposition. Financial projection masuk akal.',
                    'Good market analysis tapi perlu lebih detail pada competitive landscape.',
                    'Solid business model dengan multiple revenue streams. Go-to-market strategy well-thought.',
                    'Strong value proposition untuk UMKM. Pricing strategy competitive dan sustainable.',
                ]
            ],

            'Technical Documentation' => [
                'links' => [
                    'https://drive.google.com/file/d/technical_doc_traffic_ai_v1.0.pdf',
                    'https://www.dropbox.com/s/elearning_tech_documentation.pdf',
                    'https://drive.google.com/file/d/iot_farming_technical_specs.pdf',
                    'https://github.com/umkm-digital/docs/blob/main/technical-documentation.pdf',
                ],
                'notes' => [
                    'Dokumentasi lengkap arsitektur microservices, API endpoints, database schema, dan deployment guide untuk sistem traffic management.',
                    'Technical specs platform e-learning mencakup system architecture, ML algorithm documentation, API reference, dan security protocols.',
                    'Dokumentasi IoT system dengan hardware specifications, communication protocols, data processing pipeline, dan troubleshooting guide.',
                    'Complete technical documentation dengan API docs, database design, security implementation, dan scalability considerations.',
                ],
                'feedback' => [
                    'Dokumentasi sangat comprehensive dan well-structured. Architecture scalable dan secure.',
                    'Good documentation tapi perlu tambahan pada performance optimization strategies.',
                    'Excellent technical specs dengan clear hardware-software integration explanation.',
                    'Very detailed documentation. Security measures well-documented dan implementation guide clear.',
                ]
            ],

            // Final submissions
            'Final Presentation Deck' => [
                'links' => [
                    'https://drive.google.com/file/d/final_presentation_traffic_ai.pptx',
                    'https://www.dropbox.com/s/final_pitch_elearning.pdf',
                    'https://drive.google.com/file/d/smart_farming_final_deck.pptx',
                    'https://onedrive.live.com/download?resid=umkm_final_presentation.pptx',
                ],
                'notes' => [
                    'Slide presentasi final untuk solusi AI traffic management. Mencakup problem statement, solution overview, technical implementation, business impact, dan future roadmap.',
                    'Final pitch deck platform e-learning adaptif dengan demo results, user feedback, market traction, dan scaling strategy.',
                    'Presentasi final IoT smart farming dengan case study implementasi, ROI analysis, dan expansion plan.',
                    'Final deck digitalisasi UMKM dengan success metrics, user testimonials, market penetration, dan sustainability plan.',
                ],
                'feedback' => [
                    'Outstanding presentation dengan clear storyline. Technical solution well-explained dan business impact compelling.',
                    'Excellent presentation skills. Demo results sangat convincing dan roadmap realistic.',
                    'Very professional presentation dengan strong data-driven insights. Implementation case study impressive.',
                    'Great storytelling dan market validation. User testimonials powerful dan growth strategy solid.',
                ]
            ],

            'Product Demo Video' => [
                'links' => [
                    'https://www.youtube.com/watch?v=DEMO_TRAFFIC_AI_2024',
                    'https://vimeo.com/987654321/elearning-platform-demo',
                    'https://youtu.be/SMART_FARMING_DEMO_FINAL',
                    'https://drive.google.com/file/d/umkm_platform_demo_video.mp4',
                ],
                'notes' => [
                    'Demo video showing complete user journey dari setup sistem hingga real-time traffic optimization. Termasuk dashboard admin dan mobile app untuk traffic officers.',
                    'Comprehensive demo platform e-learning dari perspective student, instructor, dan admin. Showcase adaptive learning algorithm dan analytics features.',
                    'Full product demo IoT smart farming system dari sensor installation hingga harvest optimization. Termasuk mobile app dan web dashboard.',
                    'Complete demo platform UMKM dari onboarding merchant hingga customer transaction. Showcase semua fitur utama dan integration dengan payment gateway.',
                ],
                'feedback' => [
                    'Exceptional demo video! User journey sangat clear dan product functionality well-demonstrated.',
                    'Great demo dengan good narration. Platform features showcased effectively.',
                    'Impressive demo dengan real-world scenario. Technical implementation clearly visible.',
                    'Excellent product showcase dengan comprehensive feature walkthrough. Very professional production.',
                ]
            ],

            'Implementation Roadmap' => [
                'links' => [
                    'https://drive.google.com/file/d/implementation_roadmap_traffic_2025.pdf',
                    'https://www.dropbox.com/s/elearning_roadmap_5years.pdf',
                    'https://drive.google.com/file/d/smart_farming_expansion_plan.pdf',
                    'https://onedrive.live.com/download?resid=umkm_growth_roadmap.pdf',
                ],
                'notes' => [
                    'Roadmap implementasi 5 tahun untuk ekspansi ke 10 kota besar di Indonesia. Mencakup partnership dengan pemerintah daerah dan strategi teknologi.',
                    'Implementation plan platform e-learning dengan target 1000 institusi pendidikan dalam 3 tahun. Termasuk internationalization strategy.',
                    'Roadmap ekspansi smart farming solution ke 5000 petani dalam 2 tahun dengan model kemitraan koperasi dan bank.',
                    'Growth roadmap platform UMKM untuk acquire 10,000 merchants dan facilitate $100M GMV dalam 3 tahun.',
                ],
                'feedback' => [
                    'Very realistic dan achievable roadmap. Partnership strategy well-planned dan market entry systematic.',
                    'Ambitious tapi realistic growth plan. International expansion strategy well-researched.',
                    'Solid implementation plan dengan clear milestones. Partnership model dengan koperasi innovative.',
                    'Excellent growth strategy dengan clear metrics dan sustainable business model.',
                ]
            ],

            // Additional assignments untuk memperkaya data
            'User Research & Analysis' => [
                'links' => [
                    'https://drive.google.com/file/d/user_research_report_2024.pdf',
                    'https://www.dropbox.com/s/market_analysis_tech_solution.pdf',
                    'https://drive.google.com/file/d/user_survey_insights.pdf',
                    'https://onedrive.live.com/download?resid=customer_interview_summary.pdf',
                ],
                'notes' => [
                    'Hasil riset mendalam terhadap 500 responden untuk memvalidasi problem statement dan kebutuhan pasar.',
                    'Analisis komprehensif terhadap target user dengan metodologi design thinking dan user journey mapping.',
                    'Survey dan interview dengan stakeholder utama untuk memahami pain points dan ekspektasi solusi.',
                    'Research report mencakup persona development, market sizing, dan competitive analysis.',
                ],
                'feedback' => [
                    'Research methodology sangat solid dan sample size representative. Insights valuable untuk product development.',
                    'Good research approach tapi perlu dig deeper pada specific user segments.',
                    'Excellent user research dengan actionable insights. Persona development well-documented.',
                    'Comprehensive analysis dengan clear recommendation untuk next steps.',
                ]
            ],

            'MVP Testing Report' => [
                'links' => [
                    'https://drive.google.com/file/d/mvp_testing_results_q4.pdf',
                    'https://www.dropbox.com/s/beta_testing_analysis.pdf',
                    'https://drive.google.com/file/d/user_feedback_compilation.pdf',
                    'https://github.com/team-innovate/mvp-testing-report',
                ],
                'notes' => [
                    'Hasil testing MVP dengan 100 beta users selama 2 minggu. Success metrics: 85% user retention, 4.2/5 satisfaction score.',
                    'Comprehensive testing report mencakup usability testing, A/B testing, dan performance metrics.',
                    'Beta testing dengan diverse user groups untuk validate product-market fit dan identify improvement areas.',
                    'MVP testing results dengan detailed analytics, user feedback, dan prioritized feature requests.',
                ],
                'feedback' => [
                    'Excellent testing methodology dengan comprehensive metrics. User feedback well-analyzed.',
                    'Good testing coverage tapi perlu extend testing period untuk better insights.',
                    'Impressive user retention rate. Testing report sangat detailed dan actionable.',
                    'Solid testing approach dengan clear improvement recommendations.',
                ]
            ],

            'Market Validation Study' => [
                'links' => [
                    'https://drive.google.com/file/d/market_validation_comprehensive.pdf',
                    'https://www.dropbox.com/s/competitive_landscape_analysis.pdf',
                    'https://drive.google.com/file/d/tam_sam_som_analysis.pdf',
                    'https://onedrive.live.com/download?resid=market_opportunity_assessment.pdf',
                ],
                'notes' => [
                    'Validasi pasar dengan analisis TAM $2.5B, SAM $500M, SOM $50M untuk solusi teknologi di Indonesia.',
                    'Comprehensive market study mencakup trend analysis, regulatory landscape, dan adoption barriers.',
                    'Market validation melalui pilot project dengan 5 enterprise clients dan hasil positif.',
                    'Detailed competitive analysis dengan positioning strategy dan differentiation factors.',
                ],
                'feedback' => [
                    'Thorough market analysis dengan realistic market sizing. Competitive positioning well-thought.',
                    'Good market validation tapi perlu more specific pada go-to-market timeline.',
                    'Excellent market opportunity assessment. TAM-SAM-SOM calculation realistic.',
                    'Solid validation study dengan clear market entry strategy.',
                ]
            ],

            'Financial Projection' => [
                'links' => [
                    'https://drive.google.com/file/d/financial_model_5year.xlsx',
                    'https://www.dropbox.com/s/revenue_projection_detailed.pdf',
                    'https://drive.google.com/file/d/startup_financial_planning.pdf',
                    'https://onedrive.live.com/download?resid=investment_proposal_deck.pdf',
                ],
                'notes' => [
                    'Model finansial 5 tahun dengan proyeksi revenue $10M di year 3, break-even di month 18.',
                    'Detailed financial projection mencakup revenue streams, cost structure, dan funding requirements.',
                    'Comprehensive financial planning dengan scenario analysis (optimistic, realistic, pessimistic).',
                    'Investment proposal dengan funding request $2M untuk scaling dan market expansion.',
                ],
                'feedback' => [
                    'Financial model realistic dengan conservative assumptions. Revenue projections achievable.',
                    'Good financial planning tapi perlu more detail pada customer acquisition cost.',
                    'Excellent financial projection dengan well-justified assumptions dan clear funding needs.',
                    'Solid financial model dengan proper sensitivity analysis.',
                ]
            ],

            'Technology Stack Documentation' => [
                'links' => [
                    'https://github.com/tech-team/architecture-documentation',
                    'https://drive.google.com/file/d/tech_stack_overview.pdf',
                    'https://www.dropbox.com/s/system_architecture_diagram.pdf',
                    'https://confluence.company.com/tech-stack-decision',
                ],
                'notes' => [
                    'Dokumentasi lengkap tech stack: React/Next.js frontend, Node.js backend, PostgreSQL database, AWS infrastructure.',
                    'Architecture overview dengan microservices pattern, API Gateway, dan containerization menggunakan Docker.',
                    'Technology selection rationale dengan performance benchmarks dan scalability considerations.',
                    'Complete development stack documentation dengan deployment pipeline dan monitoring setup.',
                ],
                'feedback' => [
                    'Well-documented architecture dengan modern tech stack. Scalability well-considered.',
                    'Good technology choices tapi perlu explanation pada specific framework selections.',
                    'Excellent documentation dengan clear rationale untuk each technology decision.',
                    'Solid architecture design dengan proper separation of concerns.',
                ]
            ],

            'Security & Compliance Report' => [
                'links' => [
                    'https://drive.google.com/file/d/security_assessment_report.pdf',
                    'https://www.dropbox.com/s/compliance_checklist_completed.pdf',
                    'https://drive.google.com/file/d/penetration_testing_results.pdf',
                    'https://onedrive.live.com/download?resid=gdpr_compliance_documentation.pdf',
                ],
                'notes' => [
                    'Security assessment mencakup penetration testing, vulnerability scanning, dan compliance audit.',
                    'Comprehensive security report dengan OWASP Top 10 compliance dan data protection measures.',
                    'Compliance documentation untuk GDPR, ISO 27001, dan regulasi lokal Indonesia.',
                    'Security implementation dengan encryption, authentication, authorization, dan audit logging.',
                ],
                'feedback' => [
                    'Thorough security assessment dengan comprehensive protection measures. Compliance well-documented.',
                    'Good security practices tapi perlu regular security audit schedule.',
                    'Excellent security implementation dengan industry best practices.',
                    'Solid compliance framework dengan proper documentation.',
                ]
            ],

            'User Experience Design' => [
                'links' => [
                    'https://www.figma.com/file/ux-design-system-2024',
                    'https://drive.google.com/file/d/user_interface_mockups.pdf',
                    'https://www.dropbox.com/s/ux_research_findings.pdf',
                    'https://invision.app/prototype/mobile-app-design',
                ],
                'notes' => [
                    'Complete UX design dengan user research, wireframes, prototypes, dan design system.',
                    'User interface design mencakup responsive web dan mobile app dengan accessibility standards.',
                    'UX research findings dengan usability testing results dan design iterations.',
                    'Design system documentation dengan component library dan style guide.',
                ],
                'feedback' => [
                    'Outstanding UX design dengan user-centered approach. Design system well-structured.',
                    'Good design work tapi perlu more user testing validation.',
                    'Excellent user experience dengan intuitive interface design.',
                    'Solid design approach dengan proper design thinking methodology.',
                ]
            ],

            'Partnership Strategy' => [
                'links' => [
                    'https://drive.google.com/file/d/partnership_proposal_ecosystem.pdf',
                    'https://www.dropbox.com/s/strategic_alliance_plan.pdf',
                    'https://drive.google.com/file/d/channel_partner_strategy.pdf',
                    'https://onedrive.live.com/download?resid=collaboration_framework.pdf',
                ],
                'notes' => [
                    'Strategic partnership proposal dengan 5 key players di industri untuk accelerate market penetration.',
                    'Channel partnership strategy dengan distributor, reseller, dan system integrator.',
                    'Collaboration framework dengan universitas, research institution, dan government agencies.',
                    'Partnership ecosystem development untuk create value network dan competitive advantage.',
                ],
                'feedback' => [
                    'Strategic partnership plan well-thought dengan clear value proposition untuk partners.',
                    'Good partnership strategy tapi perlu more specific pada partnership terms.',
                    'Excellent ecosystem approach dengan complementary partnerships.',
                    'Solid collaboration framework dengan mutual benefit structure.',
                ]
            ],

            'Sustainability Impact Assessment' => [
                'links' => [
                    'https://drive.google.com/file/d/sustainability_impact_report.pdf',
                    'https://www.dropbox.com/s/environmental_assessment.pdf',
                    'https://drive.google.com/file/d/social_impact_measurement.pdf',
                    'https://onedrive.live.com/download?resid=sdg_alignment_analysis.pdf',
                ],
                'notes' => [
                    'Impact assessment terhadap SDGs dengan fokus pada Quality Education, Industry Innovation, dan Sustainable Cities.',
                    'Environmental impact analysis dengan carbon footprint calculation dan green technology adoption.',
                    'Social impact measurement dengan community empowerment metrics dan digital inclusion.',
                    'Sustainability framework dengan ESG compliance dan long-term value creation.',
                ],
                'feedback' => [
                    'Comprehensive sustainability assessment dengan clear SDG alignment. Impact metrics well-defined.',
                    'Good sustainability approach tapi perlu more quantitative impact measurement.',
                    'Excellent ESG framework dengan measurable social and environmental benefits.',
                    'Solid sustainability strategy dengan long-term value creation focus.',
                ]
            ],

            'Intellectual Property Portfolio' => [
                'links' => [
                    'https://drive.google.com/file/d/ip_portfolio_documentation.pdf',
                    'https://www.dropbox.com/s/patent_application_filing.pdf',
                    'https://drive.google.com/file/d/trademark_registration_status.pdf',
                    'https://onedrive.live.com/download?resid=copyright_protection_strategy.pdf',
                ],
                'notes' => [
                    'IP portfolio mencakup 3 patent applications, trademark registration, dan copyright protection.',
                    'Intellectual property strategy untuk protect core technology dan create competitive moat.',
                    'Patent filing untuk key innovations dengan prior art analysis dan patentability assessment.',
                    'IP protection framework dengan licensing strategy dan enforcement mechanisms.',
                ],
                'feedback' => [
                    'Well-structured IP portfolio dengan strategic patent applications. Protection strategy comprehensive.',
                    'Good IP approach tapi perlu accelerate patent filing process.',
                    'Excellent intellectual property strategy dengan clear competitive protection.',
                    'Solid IP framework dengan proper documentation dan filing procedures.',
                ]
            ],
        ];

        $createdSubmissions = 0;

        foreach ($assignments as $assignment) {
            $template = $submissionTemplates[$assignment->title] ?? null;
            
            if (!$template) {
                $this->command->warn("No template found for assignment: {$assignment->title}");
                continue;
            }

            // For each assignment, randomly select more teams to submit
            $submittingTeams = $teams->random(min($teams->count(), rand(8, 15))); // Increased from rand(3, 8) to rand(8, 15)

            foreach ($submittingTeams as $team) {
                // Check if submission already exists (unique constraint)
                $existingSubmission = AssignmentSubmission::where([
                    'assignment_id' => $assignment->id,
                    'team_registration_id' => $team->id
                ])->first();

                if ($existingSubmission) {
                    continue; // Skip if already exists
                }

                // Determine submission timing
                $stageStartDate = $assignment->competitionStage->start_date 
                    ? Carbon::parse($assignment->competitionStage->start_date) 
                    : Carbon::now()->subDays(30);
                
                $assignmentDeadline = Carbon::parse($assignment->deadline);
                
                // Most teams submit before deadline, some are late
                $isLate = $faker->boolean(15); // 15% chance of late submission
                
                if ($isLate) {
                    $submittedAt = $assignmentDeadline->copy()->addHours(rand(1, 48));
                    $status = 'late';
                } else {
                    $submittedAt = $faker->dateTimeBetween(
                        $stageStartDate,
                        $assignmentDeadline->copy()->subHours(1)
                    );
                    $status = $faker->randomElement(['pending', 'graded']);
                }

                // If status is graded, add grading information
                $gradedBy = null;
                $gradedAt = null;
                $grade = null;
                $feedback = null;

                if ($status === 'graded') {
                    $gradedBy = $admins->random()->id;
                    $gradedAt = Carbon::parse($submittedAt)->addDays(rand(1, 3));
                    
                    // Generate realistic grades based on assignment type
                    if (in_array($assignment->title, ['Validasi Berkas Pendaftaran'])) {
                        // Registration assignments: pass/fail (0 or 100)
                        $grade = $faker->boolean(90) ? 100.00 : 0.00;
                    } else {
                        // Other assignments: realistic grade distribution
                        $grade = $faker->randomFloat(2, 60, 100);
                    }
                    
                    $feedback = $faker->randomElement($template['feedback']);
                }

                AssignmentSubmission::create([
                    'assignment_id' => $assignment->id,
                    'team_registration_id' => $team->id,
                    'submission_link' => $faker->randomElement($template['links']),
                    'notes' => $faker->randomElement($template['notes']),
                    'status' => $status,
                    'grade' => $grade,
                    'feedback' => $feedback,
                    'graded_by' => $gradedBy,
                    'graded_at' => $gradedAt,
                    'submitted_at' => $submittedAt,
                    'created_at' => $submittedAt,
                    'updated_at' => $gradedAt ?? $submittedAt,
                ]);

                $createdSubmissions++;
            }

            $this->command->info("Created submissions for: {$assignment->title}");
        }

        $this->command->info("Assignment submission seeder completed! Created {$createdSubmissions} submissions.");
    }
}
