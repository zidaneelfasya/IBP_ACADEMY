<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\CourseFile;
use App\Models\User;
use App\Models\CompetitionCategory;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin user (assuming first user is admin)
        $adminUser = User::first();
        
        if (!$adminUser) {
            $this->command->error('No users found. Please run UserSeeder first.');
            return;
        }

        // Get competition categories from database
        $bccCategory = CompetitionCategory::where('name', 'BCC')->first();
        $bpcCategory = CompetitionCategory::where('name', 'BPC')->first();
        
        if (!$bccCategory || !$bpcCategory) {
            $this->command->error('Competition categories not found. Please run CompetitionCategoriesSeeder first.');
            return;
        }

        $courses = [
            // ===== BUSINESS CASE COMPETITION (BCC) COURSES =====
            [
                'title' => 'Fundamental Business Case Analysis',
                'description' => 'Panduan dasar untuk menganalisis kasus bisnis dengan framework yang tepat dan pendekatan sistematis.',
                'content' => 'Modul ini memberikan fondasi yang kuat dalam analisis kasus bisnis. Anda akan mempelajari berbagai framework analisis seperti SWOT, Porter\'s Five Forces, PEST Analysis, dan Value Chain Analysis. Materi mencakup cara mengidentifikasi masalah utama dalam kasus bisnis, mengumpulkan dan menganalisis data yang relevan, serta menyusun solusi yang actionable. Dilengkapi dengan contoh kasus nyata dari berbagai industri dan latihan praktis untuk mengasah kemampuan analitis.',
                'competition_category_id' => $bccCategory->id,
                'video_url' => 'https://youtube.com/watch?v=bcc-fundamental-2024',
                'read_count' => 128,
                'is_semifinal' => false,
            ],
            [
                'title' => 'Strategic Problem Solving & Decision Making',
                'description' => 'Teknik pemecahan masalah strategis dan pengambilan keputusan untuk Business Case Competition.',
                'content' => 'Modul ini fokus pada pengembangan kemampuan strategic thinking dan decision making yang krusial dalam BCC. Anda akan belajar metodologi pemecahan masalah yang terstruktur, teknik root cause analysis, dan framework untuk evaluasi alternatif solusi. Materi mencakup decision trees, scenario analysis, risk assessment, dan implementation planning. Dilengkapi dengan simulasi kasus kompleks dan time-pressured decision making exercises.',
                'competition_category_id' => $bccCategory->id,
                'video_url' => 'https://vimeo.com/strategic-thinking-bcc',
                'read_count' => 97,
                'is_semifinal' => false,
            ],
            [
                'title' => 'Advanced Case Analysis untuk Semifinalis BCC',
                'description' => 'Teknik analisis kasus tingkat lanjut dengan framework kompleks untuk peserta semifinal BCC.',
                'content' => 'Materi khusus untuk semifinalis BCC yang mencakup advanced analytical frameworks seperti Blue Ocean Strategy, Business Model Canvas, McKinsey 7S, dan Real Options Analysis. Anda akan mempelajari cara menganalisis kasus multidimensional dengan berbagai stakeholder, mengelola ambiguitas dan informasi yang terbatas, serta mengembangkan solusi inovatif yang sustainable. Materi mencakup case study dari konsultasi tier-1 dan best practices dari pemenang kompetisi internasional.',
                'competition_category_id' => $bccCategory->id,
                'video_url' => 'https://youtube.com/watch?v=advanced-bcc-analysis',
                'read_count' => 45,
                'is_semifinal' => true,
            ],
            [
                'title' => 'Presentation Excellence & Communication Skills',
                'description' => 'Master presentasi dan komunikasi yang efektif untuk menyampaikan analisis kasus bisnis.',
                'content' => 'Kemampuan presentasi yang excellent adalah pembeda utama dalam BCC. Modul ini mengajarkan struktur presentasi yang compelling, teknik storytelling untuk business cases, penggunaan data visualization yang impactful, dan body language yang persuasif. Anda akan belajar cara mengelola waktu presentasi, handling Q&A dengan confidence, dan teknik untuk membangun rapport dengan juri. Dilengkapi dengan video analysis dari presentasi terbaik dan practice sessions yang intensif.',
                'competition_category_id' => $bccCategory->id,
                'video_url' => 'https://youtube.com/watch?v=presentation-mastery',
                'read_count' => 156,
                'is_semifinal' => false,
            ],
            [
                'title' => 'Industry-Specific Case Studies & Trends',
                'description' => 'Analisis mendalam tentang tren industri dan case studies spesifik untuk berbagai sektor bisnis.',
                'content' => 'Modul komprehensif yang mencakup analisis mendalam berbagai industri seperti teknologi, healthcare, retail, financial services, dan manufacturing. Anda akan mempelajari karakteristik unik setiap industri, key performance indicators, regulatory environment, dan emerging trends yang mempengaruhi strategi bisnis. Materi dilengkapi dengan recent case studies, industry reports, dan insights dari praktisi senior di berbagai sektor.',
                'competition_category_id' => $bccCategory->id,
                'video_url' => null,
                'read_count' => 73,
                'is_semifinal' => false,
            ],

            // ===== BUSINESS PLAN COMPETITION (BPC) COURSES =====
            [
                'title' => 'Business Model Innovation & Design',
                'description' => 'Panduan lengkap untuk merancang dan menginovasi model bisnis yang sustainable dan scalable.',
                'content' => 'Modul foundational untuk BPC yang mengajarkan cara merancang business model yang inovatif dan sustainable. Anda akan mempelajari Business Model Canvas, Value Proposition Design, Customer Development, dan Lean Startup methodology. Materi mencakup identifikasi market opportunities, customer segmentation, revenue stream design, dan cost structure optimization. Dilengkapi dengan template praktis, worksheets interaktif, dan contoh business model dari startup unicorn.',
                'competition_category_id' => $bpcCategory->id,
                'video_url' => 'https://youtube.com/watch?v=business-model-innovation',
                'read_count' => 142,
                'is_semifinal' => false,
            ],
            [
                'title' => 'Market Research & Validation Mastery',
                'description' => 'Teknik riset pasar dan validasi ide bisnis yang comprehensive dan evidence-based.',
                'content' => 'Riset pasar yang solid adalah kunci sukses setiap business plan. Modul ini mengajarkan metodologi riset yang comprehensive mulai dari primary research (surveys, interviews, focus groups) hingga secondary research (industry reports, competitor analysis). Anda akan belajar cara merancang research methodology, sampling techniques, data collection dan analysis, serta cara memvalidasi asumsi bisnis dengan MVP dan pilot testing. Dilengkapi dengan tools dan platform digital untuk riset yang cost-effective.',
                'competition_category_id' => $bpcCategory->id,
                'video_url' => 'https://vimeo.com/market-research-mastery',
                'read_count' => 118,
                'is_semifinal' => false,
            ],
            [
                'title' => 'Financial Modeling & Investment Analysis',
                'description' => 'Pemodelan keuangan yang robust dan analisis investasi untuk business plan yang meyakinkan.',
                'content' => 'Modul essential yang mengajarkan cara membangun financial model yang robust dan realistic. Anda akan mempelajari forecasting techniques, scenario analysis, sensitivity analysis, dan cash flow modeling. Materi mencakup startup valuation methods (DCF, comparable, venture capital method), funding requirements calculation, dan ROI analysis. Dilengkapi dengan Excel templates, financial modeling best practices, dan case studies dari successful funding rounds.',
                'competition_category_id' => $bpcCategory->id,
                'video_url' => 'https://youtube.com/watch?v=financial-modeling-startup',
                'read_count' => 91,
                'is_semifinal' => false,
            ],
            [
                'title' => 'Advanced Pitch Techniques & Investor Relations',
                'description' => 'Teknik pitch yang advanced dan strategi untuk membangun hubungan dengan investor.',
                'content' => 'Materi khusus untuk semifinalis BPC yang fokus pada advanced pitching techniques dan investor relations. Anda akan mempelajari psychology of persuasion, storytelling for entrepreneurs, objection handling, dan negotiation tactics. Materi mencakup berbagai jenis investor (angel, VC, corporate), due diligence preparation, term sheet understanding, dan post-investment relationship management. Dilengkapi dengan pitch deck analysis dari startup successful dan mock investor sessions.',
                'competition_category_id' => $bpcCategory->id,
                'video_url' => 'https://vimeo.com/advanced-pitch-techniques',
                'read_count' => 38,
                'is_semifinal' => true,
            ],
            [
                'title' => 'Scaling Strategy & Growth Hacking',
                'description' => 'Strategi scaling bisnis dan growth hacking techniques untuk startup yang sustainable.',
                'content' => 'Modul advanced yang mengajarkan strategi untuk scaling bisnis dari startup ke growth stage. Anda akan mempelajari growth metrics dan KPIs, customer acquisition strategies, viral marketing, product-market fit optimization, dan operational scaling. Materi mencakup digital marketing strategies, partnership development, international expansion, dan organizational development. Dilengkapi dengan case studies dari scaleup successful dan actionable growth hacking techniques.',
                'competition_category_id' => $bpcCategory->id,
                'video_url' => 'https://youtube.com/watch?v=scaling-growth-hacking',
                'read_count' => 67,
                'is_semifinal' => false,
            ],

            // ===== CROSS-CATEGORY COURSES =====
            [
                'title' => 'Digital Transformation & Technology Trends',
                'description' => 'Pemahaman mendalam tentang digital transformation dan emerging technology trends.',
                'content' => 'Modul yang relevan untuk kedua kategori kompetisi, mengcover digital transformation trends yang mengubah landscape bisnis. Anda akan mempelajari impact of AI, blockchain, IoT, dan emerging technologies terhadap berbagai industri. Materi mencakup digital business model, data-driven decision making, cybersecurity implications, dan ethical considerations dalam teknologi. Essential untuk memahami future of business dan mengintegrasikan tech solutions dalam business cases dan plans.',
                'competition_category_id' => $bccCategory->id,
                'video_url' => 'https://youtube.com/watch?v=digital-transformation-trends',
                'read_count' => 104,
                'is_semifinal' => false,
            ],
            [
                'title' => 'Sustainability & ESG Business Integration',
                'description' => 'Integrasi prinsip sustainability dan ESG dalam strategi dan operasi bisnis modern.',
                'content' => 'Modul yang mengajarkan pentingnya Environmental, Social, dan Governance (ESG) factors dalam bisnis modern. Anda akan mempelajari sustainable business models, circular economy principles, impact measurement, dan ESG reporting standards. Materi mencakup stakeholder capitalism, sustainable finance, carbon footprint analysis, dan social impact assessment. Critical untuk mengembangkan business solutions yang tidak hanya profitable tapi juga sustainable dan socially responsible.',
                'competition_category_id' => $bpcCategory->id,
                'video_url' => 'https://vimeo.com/sustainability-esg-business',
                'read_count' => 82,
                'is_semifinal' => false,
            ],
            [
                'title' => 'Elite Strategy Consulting Frameworks',
                'description' => 'Framework dan metodologi elite strategy consulting untuk analisis bisnis tingkat expert.',
                'content' => 'Materi eksklusif untuk semifinalis yang mengcover advanced frameworks dari top-tier consulting firms seperti McKinsey, BCG, dan Bain. Anda akan mempelajari proprietary frameworks seperti McKinsey Capability Building, BCG Experience Curve, Bain Repeatable Models, dan advanced problem-solving methodologies. Materi mencakup structured problem solving, hypothesis-driven approach, dan executive communication techniques yang digunakan oleh konsultan senior untuk menyelesaikan complex business challenges.',
                'competition_category_id' => $bccCategory->id,
                'video_url' => 'https://youtube.com/watch?v=elite-consulting-frameworks',
                'read_count' => 27,
                'is_semifinal' => true,
            ]
        ];

        foreach ($courses as $courseData) {
            $course = Course::create([
                'title' => $courseData['title'],
                'description' => $courseData['description'],
                'content' => $courseData['content'],
                'competition_category_id' => $courseData['competition_category_id'],
                'video_url' => $courseData['video_url'] ?? null,
                'read_count' => $courseData['read_count'],
                'is_semifinal' => $courseData['is_semifinal'],
                'is_active' => true,
                'created_by' => $adminUser->id,
            ]);

            // Add some sample files for each course
            $sampleFiles = [
                [
                    'original_name' => 'panduan_' . str_replace(' ', '_', strtolower($course->title)) . '.pdf',
                    'file_name' => 'course_' . $course->id . '_panduan.pdf',
                    'file_path' => 'courses/' . $course->id . '/panduan.pdf',
                    'file_type' => 'document',
                    'mime_type' => 'application/pdf',
                    'file_size' => rand(500000, 2000000), // 500KB - 2MB
                ],
                [
                    'original_name' => 'template_' . str_replace(' ', '_', strtolower($course->title)) . '.pptx',
                    'file_name' => 'course_' . $course->id . '_template.pptx',
                    'file_path' => 'courses/' . $course->id . '/template.pptx',
                    'file_type' => 'document',
                    'mime_type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'file_size' => rand(1000000, 5000000), // 1MB - 5MB
                ]
            ];

            foreach ($sampleFiles as $fileData) {
                CourseFile::create([
                    'course_id' => $course->id,
                    'original_name' => $fileData['original_name'],
                    'file_name' => $fileData['file_name'],
                    'file_path' => $fileData['file_path'],
                    'file_type' => $fileData['file_type'],
                    'mime_type' => $fileData['mime_type'],
                    'file_size' => $fileData['file_size'],
                ]);
            }
        }

        $this->command->info('CourseSeeder completed successfully!');
    $this->command->info('Created ' . count($courses) . ' comprehensive courses with sample files:');
    
    $generalCourses = count(array_filter($courses, fn($course) => $course['is_semifinal'] === false));
    $semifinalCourses = count(array_filter($courses, fn($course) => $course['is_semifinal'] === true));
    $this->command->info('- ' . $generalCourses . ' general access courses');
    $this->command->info('- ' . $semifinalCourses . ' semifinal exclusive courses');
    
    $this->command->info('- Coverage: BCC and BPC competition categories with cross-category content');
    }
}
