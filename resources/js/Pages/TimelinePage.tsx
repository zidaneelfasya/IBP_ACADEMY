import { Calendar, Users, FileText, Trophy, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"

const timelineEvents = [
  {
    id: 1,
    title: "Registrasi Tahap 1",
    date: "08 - 14 Agustus 2025",
    description: "Periode pendaftaran awal untuk peserta lomba IBP 2025",
    type: "registration",
    icon: Users,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Registrasi Tahap 2",
    date: "15 - 21 Agustus 2025",
    description: "Periode pendaftaran tahap kedua",
    type: "registration",
    icon: Users,
    status: "upcoming",
  },
  {
    id: 3,
    title: "Technical Meeting Preliminary Round",
    date: "24 Agustus 2025",
    description: "Pertemuan teknis untuk babak penyisihan",
    type: "meeting",
    icon: FileText,
    status: "upcoming",
  },
  {
    id: 4,
    title: "Preliminary Round",
    date: "15 - 31 Agustus 2025",
    description: "Case Release (15 Agustus) • Materi (15 Agustus) • Batas pengumpulan (31 Agustus)",
    type: "competition",
    icon: Trophy,
    status: "upcoming",
    details: ["Case Release: 15 Agustus 2025", "Materi: 15 Agustus 2025", "Batas pengumpulan: 31 Agustus 2025"],
  },
  {
    id: 5,
    title: "Penilaian Preliminary Round",
    date: "04 - 08 September 2025",
    description: "Periode penilaian babak penyisihan",
    type: "evaluation",
    icon: CheckCircle,
    status: "upcoming",
  },
  {
    id: 6,
    title: "Pengumuman Semifinalis",
    date: "09 September 2025",
    description: "Pengumuman peserta yang lolos ke babak semifinal",
    type: "announcement",
    icon: Trophy,
    status: "upcoming",
  },
  {
    id: 7,
    title: "Registrasi Ulang Tahap 1",
    date: "09 - 13 September 2025",
    description: "Pendaftaran ulang untuk semifinalis tahap pertama",
    type: "registration",
    icon: Users,
    status: "upcoming",
  },
  {
    id: 8,
    title: "Registrasi Ulang Tahap 2",
    date: "14 - 16 September 2025",
    description: "Pendaftaran ulang untuk semifinalis tahap kedua",
    type: "registration",
    icon: Users,
    status: "upcoming",
  },
  {
    id: 9,
    title: "Pengumpulan Semifinalis",
    date: "10 - 23 September 2025",
    description: "Case release BCC (10 Sept) • Materi BPC and BCC (10 Sept) • Batas pengumpulan (23 Sept)",
    type: "competition",
    icon: Trophy,
    status: "upcoming",
    details: [
      "Case release BCC: 10 September 2025",
      "Materi BPC and BCC: 10 September 2025",
      "Batas pengumpulan: 23 September 2025",
    ],
  },
  {
    id: 10,
    title: "Penilaian Semifinalis",
    date: "24 - 28 September 2025",
    description: "Periode penilaian babak semifinal",
    type: "evaluation",
    icon: CheckCircle,
    status: "upcoming",
  },
  {
    id: 11,
    title: "Pengumuman Finalis",
    date: "30 September 2025",
    description: "Pengumuman peserta yang lolos ke babak final",
    type: "announcement",
    icon: Trophy,
    status: "upcoming",
  },
  {
    id: 12,
    title: "Pengumpulan Finalis",
    date: "01 - 20 Oktober 2025",
    description: "Periode pengumpulan tugas untuk finalis",
    type: "competition",
    icon: Trophy,
    status: "upcoming",
  },
  {
    id: 13,
    title: "Technical Meeting Final Round",
    date: "03 Oktober 2025",
    description: "Pertemuan teknis untuk babak final",
    type: "meeting",
    icon: FileText,
    status: "upcoming",
  },
  {
    id: 14,
    title: "Mentoring Session",
    date: "04, 05, 11, 12, 18 Oktober 2025",
    description: "Sesi mentoring untuk finalis",
    type: "mentoring",
    icon: Users,
    status: "upcoming",
  },
  {
    id: 15,
    title: "Day 1 IBP Internasional",
    date: "25 Oktober 2025",
    description: "Hari pertama kompetisi IBP Internasional",
    type: "final",
    icon: Trophy,
    status: "upcoming",
  },
  {
    id: 16,
    title: "Day 2 IBP Internasional",
    date: "26 Oktober 2025",
    description: "Hari kedua kompetisi IBP Internasional",
    type: "final",
    icon: Trophy,
    status: "upcoming",
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "registration":
      return "bg-blue-500"
    case "meeting":
      return "bg-purple-500"
    case "competition":
      return "bg-green-500"
    case "evaluation":
      return "bg-orange-500"
    case "announcement":
      return "bg-red-500"
    case "mentoring":
      return "bg-indigo-500"
    case "final":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case "registration":
      return "Registrasi"
    case "meeting":
      return "Meeting"
    case "competition":
      return "Kompetisi"
    case "evaluation":
      return "Penilaian"
    case "announcement":
      return "Pengumuman"
    case "mentoring":
      return "Mentoring"
    case "final":
      return "Final"
    default:
      return "Event"
  }
}

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Timeline IBP 2025</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ikuti jadwal lengkap kompetisi International Business Plan 2025. Pastikan Anda tidak melewatkan setiap
            tahapan penting dalam lomba ini.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          {/* Timeline events */}
          <div className="space-y-8">
            {timelineEvents.map((event, index) => {
              const IconComponent = event.icon
              return (
                <div key={event.id} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-6 w-4 h-4 rounded-full ${getTypeColor(event.type)} border-4 border-white shadow-lg z-10`}
                  ></div>

                  {/* Event card */}
                  <div className="ml-16 w-full">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(event.type)} text-white`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-gray-900">{event.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">{event.date}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {getTypeBadge(event.type)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-700 mb-3">{event.description}</CardDescription>

                        {/* Additional details if available */}
                        {event.details && (
                          <div className="bg-gray-50 rounded-lg p-3 mt-3">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Detail:</h4>
                            <ul className="space-y-1">
                              {event.details.map((detail, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Informasi Penting</h3>
              <p className="text-blue-100">
                Pastikan untuk selalu memantau timeline ini dan mengikuti setiap tahapan sesuai jadwal. Untuk informasi
                lebih lanjut, silakan hubungi panitia penyelenggara.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
