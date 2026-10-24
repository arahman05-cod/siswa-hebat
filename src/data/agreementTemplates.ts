export interface AgreementTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  title: string;
  objectives: string;
  positiveRules: string[];
  teacherResponsibilities: string[];
  studentResponsibilities: string[];
  educationalConsequences: string[];
  evaluationMethod: string;
}

export const agreementTemplates: AgreementTemplate[] = [
  {
    id: 'tmpl-general',
    name: 'Budaya Positif & Kelas Inklusif (Teori)',
    category: 'Umum & Teori',
    description: 'Cocok untuk ruang kelas teori dengan penekanan pada rasa saling menghormati, keaktifan berpendapat, dan kenyamanan belajar bersama.',
    title: 'Kesepakatan Belajar Bersama & Budaya Positif',
    objectives: 'Menciptakan ruang kelas yang aman, inklusif, saling menghargai martabat sesama, dan bersemangat dalam menggali ilmu pengetahuan.',
    positiveRules: [
      'Hadir tepat waktu dan menyapa rekan sekelas serta guru dengan santun.',
      'Mendengarkan dengan penuh perhatian saat seseorang sedang menyampaikan gagasan di forum kelas.',
      'Menjaga kebersihan dan ketertiban ruang belajar sebagai bentuk kepedulian lingkungan bersama.',
      'Saling membantu rekan yang mengalami kesulitan materi melalui budaya gotong-royong belajar.',
      'Menggunakan teknologi dan gawai secara bijak hanya saat diinstruksikan untuk kegiatan pembelajaran.',
    ],
    teacherResponsibilities: [
      'Menyajikan materi pembelajaran dengan metode yang ramah, variatif, dan jelas.',
      'Memberikan kesempatan berbicara secara adil kepada setiap siswa tanpa membeda-bedakan latar belakang.',
      'Merespons pertanyaan siswa dengan kesabaran dan penghargaan atas rasa ingin tahu.',
    ],
    studentResponsibilities: [
      'Mempersiapkan diri dan perlengkapan belajar sebelum pembelajaran dimulai.',
      'Menghormati kesepakatan waktu yang dibuat bersama dalam pengumpulan penugasan.',
      'Menjaga kehormatan dan kenyamanan rekan sekelas dari segala bentuk celaan atau perundungan.',
    ],
    educationalConsequences: [
      'Refleksi tertulis mandiri mengenai dampak perbuatan terhadap suasana belajar rekan sekelas.',
      'Dialog restoratif bersama guru dan siswa bersangkutan untuk mencapai pemulihan hubungan yang baik.',
      'Kontribusi positif bagi kelas (misal membantu pengelolaan mading atau penataan sarana belajar bersama).',
    ],
    evaluationMethod: 'Refleksi kelas 15 menit setiap 2 pekan sekali untuk meninjau efektivitas kesepakatan.',
  },
  {
    id: 'tmpl-tlm',
    name: 'Teknik Laboratorium Medik, Biosafety & Akurasi Pemeriksaan',
    category: 'Teknik Laboratorium Medik (TLM)',
    description: 'Dirancang khusus untuk rombel TLM (X TLM, XI TLM, XII TLM) dengan nilai ketelitian analitik, keselamatan kerja laboratorium (K3), dan kepedulian alat instrumen lab.',
    title: 'Kesepakatan Akurasi, Biosafety & Budaya Positif Kelas TLM',
    objectives: 'Mewujudkan lingkungan belajar laboratorium medik yang berintegritas tinggi, cermat dalam tahap pra-analitik, analitik, dan pasca-analitik, serta solid dalam kerjasama tim.',
    positiveRules: [
      'Menjunjung tinggi etika pemeriksaan laboratorium, kejujuran data hasil uji, dan kerahasiaan sampel pasien.',
      'Mematuhi standar biosafety, penggunaan APD lengkap (jas lab, masker, sarung tangan), dan penanganan limbah medis.',
      'Menggunakan mikroskop, spektrofotometer, dan instrumen laboratorium secara hati-hati sesuai SOP.',
      'Menjaga sterilisasi, kebersihan meja kerja lab, dan kerapian reagen bersama rekan.',
      'Saling mendampingi teman sekelas dalam praktikum analitik tanpa memanipulasi data uji.',
    ],
    teacherResponsibilities: [
      'Membimbing konsep akuntansi dan software keuangan secara terstruktur, sabar, dan aplikatif.',
      'Memfasilitasi modul latihan yang variatif dan memberikan umpan balik evaluasi yang konstruktif.',
      'Menjaga suasana pembelajaran yang adil dan terbuka bagi diskusi pemecahan masalah keuangan.',
    ],
    studentResponsibilities: [
      'Menuntaskan tugas jurnal transaksi tepat waktu sesuai linimasa yang disepakati.',
      'Aktif bertanya saat menemui selisih saldo atau kendala formula spreadsheet tanpa rasa takut.',
      'Menjaga inventaris perangkat keras dan perangkat lunak lab akuntansi sekolah.',
    ],
    educationalConsequences: [
      'Pemulihan pemahaman melalui telaah ulang mandiri mengenai alur siklus akuntansi yang keliru.',
      'Bimbingan reflektif bersama guru pengampu akuntansi untuk menguatkan nilai kejujuran.',
      'Membantu penataan modul atau pengarsipan latihan pembukuan kelas.',
    ],
    evaluationMethod: 'Evaluasi berkala setiap dua pekan pada jam wali kelas dan tinjauan portofolio akuntansi.',
  },
  {
    id: 'tmpl-farmasi',
    name: 'Laboratorium Farmasi, Peracikan Resep & K3 Klinis',
    category: 'Farmasi Klinis (Far-A, Far-B, Far-C)',
    description: 'Didesain untuk rombel Farmasi (X Far-A/B/C, XI FAR-A/B/C, XII FAR-A/B/C) dengan disiplin higienitas, etiket obat, dan kehati-hatian penimbangan.',
    title: 'Kesepakatan Disiplin Laboratorium Farmasi & Keselamatan Resep',
    objectives: 'Menanamkan budaya profesional calon tenaga teknis kefarmasian yang teliti, higienis, peduli keselamatan pasien, dan menjunjung etika kesehatan.',
    positiveRules: [
      'Wajib mengenakan jas laboratorium bersih, masker, dan penutup kepala sebelum masuk lab farmasi.',
      'Menerapkan prinsip kehati-hatian ganda (double-check) saat membaca resep, menghitung dosis, dan menimbang bahan aktif obat.',
      'Menjaga kebersihan mortir, stamper, neraca analitik, dan meja peracikan sebelum dan sesudah praktikum.',
      'Hanya mengambil bahan obat dan reagen kimia sesuai instruksi instruktur serta segera merapikannya kembali ke rak obat.',
      'Saling mengingatkan rekan bila ada potensi bahaya tumpahan zat atau ketidaktepatan takaran bahan.',
    ],
    teacherResponsibilities: [
      'Memastikan seluruh timbangan terkalibrasi dan bahan obat praktikum dalam masa simpan yang aman.',
      'Mengawasi setiap tahapan penimbangan dan peracikan sediaan obat secara cermat dan suportif.',
    ],
    studentResponsibilities: [
      'Mematuhi seluruh standar operasional prosedur kefarmasian (Good Laboratory Practice).',
      'Segera melaporkan bila terjadi pecah alat gelas atau ketidaksesuaian hasil penimbangan.',
      'Menjaga ketenangan dan konsentrasi tinggi selama proses formulasi sediaan farmasi.',
    ],
    educationalConsequences: [
      'Kajian mandiri tertulis mengenai SOP penimbangan bahan obat dan etika keselamatan pasien.',
      'Pendampingan khusus oleh asisten apoteker pada sesi peracikan modul berikutnya.',
      'Membantu sterilisasi dan penataan kembali inventaris alat laboratorium farmasi.',
    ],
    evaluationMethod: 'Pemeriksaan checklist kebersihan meja praktikum dan lembar kerja resep setiap usai sesi lab.',
  },
];
