export type Language = 'km' | 'en';

export interface Translations {
  // Navigation / Sidebar
  nav: {
    dashboard: string;
    dashboardSub: string;
    clients: string;
    clientsSub: string;
    services: string;
    servicesSub: string;
    projects: string;
    projectsSub: string;
    boq: string;
    boqSub: string;
    quotations: string;
    quotationsSub: string;
    contracts: string;
    contractsSub: string;
    finance: string;
    financeSub: string;
    inventory: string;
    inventorySub: string;
    team: string;
    teamSub: string;
    documents: string;
    documentsSub: string;
    settings: string;
    settingsSub: string;
    supportTitle: string;
    supportSub: string;
    contactSupport: string;
  };
  // Top Navigation
  topNav: {
    searchPlaceholder: string;
    notifications: string;
    markAllRead: string;
    noNotifications: string;
    profile: string;
    settings: string;
    logout: string;
  };
  // Common
  common: {
    create: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    search: string;
    filter: string;
    all: string;
    status: string;
    actions: string;
    confirm: string;
    confirmDelete: string;
    confirmDeleteMsg: string;
    loading: string;
    noData: string;
    noDataDesc: string;
    back: string;
    submit: string;
    export: string;
    downloadReport: string;
    newProject: string;
    date: string;
    amount: string;
    quantity: string;
    unit: string;
    unitPrice: string;
    total: string;
    description: string;
    notes: string;
    success: string;
    error: string;
    refresh: string;
    page: string;
    of: string;
    items: string;
    showing: string;
    to: string;
    entries: string;
    print: string;
    close: string;
  };
  // Dashboard
  dashboard: {
    greeting: string;
    subtitle: string;
    totalProjects: string;
    activeProjects: string;
    totalClients: string;
    totalRevenue: string;
    outstanding: string;
    financialOverview: string;
    financialOverviewSub: string;
    last6Months: string;
    thisYear: string;
    totalInvoiced: string;
    totalExpenses: string;
    netProfit: string;
    recentProjects: string;
    recentActivities: string;
    outstandingInvoices: string;
    upcomingDeadlines: string;
    viewAll: string;
    projectProgressOverview: string;
    equipmentDeployment: string;
    materialStockAlert: string;
  };
  // Clients
  clients: {
    title: string;
    subtitle: string;
    newClient: string;
    clientCode: string;
    name: string;
    type: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    taxId: string;
    paymentTerms: string;
    projectCount: string;
    details: string;
    projectHistory: string;
  };
  // Engineering Services
  services: {
    title: string;
    subtitle: string;
    newService: string;
    serviceCode: string;
    serviceName: string;
    serviceNameKh: string;
    category: string;
    baseRate: string;
    unit: string;
    activeStatus: string;
    description: string;
  };
  // Projects
  projects: {
    title: string;
    subtitle: string;
    newProject: string;
    projectCode: string;
    name: string;
    client: string;
    location: string;
    budget: string;
    actualCost: string;
    progress: string;
    startDate: string;
    targetEndDate: string;
    status: string;
    members: string;
    addMember: string;
    recordProgress: string;
    timeline: string;
    details: string;
    changeStatus: string;
  };
  // BOQ
  boq: {
    title: string;
    subtitle: string;
    newEstimate: string;
    estimateCode: string;
    project: string;
    estimateTitle: string;
    directCost: string;
    indirectCost: string;
    margin: string;
    totalAmount: string;
    version: string;
    itemsCount: string;
    addItem: string;
    itemNumber: string;
    itemDesc: string;
    markup: string;
    approveEstimate: string;
  };
  // Quotations
  quotations: {
    title: string;
    subtitle: string;
    newQuotation: string;
    code: string;
    client: string;
    project: string;
    subtotal: string;
    discount: string;
    vat: string;
    total: string;
    validUntil: string;
    terms: string;
    printPdf: string;
    changeStatus: string;
  };
  // Contracts
  contracts: {
    title: string;
    subtitle: string;
    newContract: string;
    code: string;
    contractNumber: string;
    titleField: string;
    contractValue: string;
    retention: string;
    period: string;
    scope: string;
    amendments: string;
    newVO: string;
    voNumber: string;
    costImpact: string;
    scheduleImpact: string;
    approveVO: string;
  };
  // Finance
  finance: {
    title: string;
    subtitle: string;
    invoices: string;
    expenses: string;
    newInvoice: string;
    newExpense: string;
    invoiceNumber: string;
    dueDate: string;
    paidAmount: string;
    balanceDue: string;
    recordPayment: string;
    paymentMethod: string;
    paymentRef: string;
    expenseCategory: string;
    vendor: string;
    receiptNumber: string;
    approveExpense: string;
    payExpense: string;
  };
  // Inventory
  inventory: {
    title: string;
    subtitle: string;
    materials: string;
    equipment: string;
    movements: string;
    newMaterial: string;
    newEquipment: string;
    recordMovement: string;
    materialCode: string;
    equipmentCode: string;
    currentStock: string;
    minimumStock: string;
    unitCost: string;
    hourlyRate: string;
    model: string;
    serial: string;
    plate: string;
    assignToProject: string;
    returnToYard: string;
    deployedProject: string;
    movementType: string;
  };
  // Team
  team: {
    title: string;
    subtitle: string;
    newUser: string;
    fullName: string;
    email: string;
    phone: string;
    jobTitle: string;
    role: string;
    status: string;
    lastLogin: string;
    permissions: string;
  };
  // Settings & Company
  settings: {
    title: string;
    subtitle: string;
    companyNameEn: string;
    companyNameKm: string;
    regNumber: string;
    vatTin: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankSwiftCode: string;
  };
}

export const translations: Record<Language, Translations> = {
  km: {
    nav: {
      dashboard: 'ផ្ទាំងគ្រប់គ្រង',
      dashboardSub: 'Dashboard',
      clients: 'អតិថិជន',
      clientsSub: 'Clients',
      services: 'សេវាកម្មវិស្វកម្ម',
      servicesSub: 'Engineering Services',
      projects: 'គម្រោង',
      projectsSub: 'Projects',
      boq: 'បរិមាណការងារ និងការប៉ាន់ស្មាន',
      boqSub: 'BOQ & Estimation',
      quotations: 'សម្រង់តម្លៃ',
      quotationsSub: 'Quotations',
      contracts: 'កិច្ចសន្យា',
      contractsSub: 'Contracts',
      finance: 'ហិរញ្ញវត្ថុ',
      financeSub: 'Finance',
      inventory: 'សម្ភារៈ និងឧបករណ៍',
      inventorySub: 'Materials & Equipment',
      team: 'បុគ្គលិក / ក្រុមការងារ',
      teamSub: 'Employees / Team',
      documents: 'ឯកសារគម្រោង',
      documentsSub: 'Project Documents',
      settings: 'ការកំណត់ក្រុមហ៊ុន',
      settingsSub: 'Settings',
      supportTitle: 'ត្រូវការជំនួយ?',
      supportSub: 'EngineerBiz Support',
      contactSupport: 'ទំនាក់ទំនងក្រុមជំនួយ',
    },
    topNav: {
      searchPlaceholder: 'ស្វែងរកគម្រោង អតិថិជន ឬឯកសារ...',
      notifications: 'ការជូនដំណឹង',
      markAllRead: 'សម្គាល់ថាបានអានទាំងអស់',
      noNotifications: 'គ្មានការជូនដំណឹងថ្មីទេ',
      profile: 'ប្រវត្តិរូប',
      settings: 'ការកំណត់',
      logout: 'ចាកចេញពីប្រព័ន្ធ',
    },
    common: {
      create: 'បង្កើតថ្មី',
      save: 'រក្សាទុក',
      cancel: 'បោះបង់',
      delete: 'លុប',
      edit: 'កែសម្រួល',
      view: 'មើលព័ត៌មានលម្អិត',
      search: 'ស្វែងរក',
      filter: 'ចម្រោះ',
      all: 'ទាំងអស់',
      status: 'ស្ថានភាព',
      actions: 'សកម្មភាព',
      confirm: 'បញ្ជាក់',
      confirmDelete: 'តើអ្នកប្រាកដថាចង់លុបទិន្នន័យនេះមែនទេ?',
      confirmDeleteMsg: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
      loading: 'កំពុងផ្ទុកទិន្នន័យ...',
      noData: 'មិនមានទិន្នន័យទេ',
      noDataDesc: 'សូមបន្ថែមទិន្នន័យថ្មី ឬផ្លាស់ប្តូរការស្វែងរករបស់អ្នក។',
      back: 'ត្រឡប់ក្រោយ',
      submit: 'ដាក់ស្នើ',
      export: 'នាំចេញ',
      downloadReport: 'ទាញយករបាយការណ៍',
      newProject: 'បង្កើតគម្រោងថ្មី',
      date: 'កាលបរិច្ឆេទ',
      amount: 'ចំនួនទឹកប្រាក់',
      quantity: 'បរិមាណ',
      unit: 'ឯកតា',
      unitPrice: 'តម្លៃឯកតា',
      total: 'សរុប',
      description: 'ការពិពណ៌នា',
      notes: 'កំណត់សម្គាល់',
      success: 'ប្រតិបត្តិការជោគជ័យ!',
      error: 'មានបញ្ហាក្នុងការតភ្ជាប់ ឬបញ្ចូលទិន្នន័យ',
      refresh: 'ផ្ទុកឡើងវិញ',
      page: 'ទំព័រ',
      of: 'នៃ',
      items: 'ជួរ',
      showing: 'បង្ហាញ',
      to: 'ដល់',
      entries: 'ធាតុ',
      print: 'បោះពុម្ព / ទាញយក PDF',
      close: 'បិទ',
    },
    dashboard: {
      greeting: 'អរុណសួស្តី,',
      subtitle: 'នេះជាសង្ខេបប្រតិបត្តិការអាជីវកម្មវិស្វកម្មរបស់អ្នកសម្រាប់ថ្ងៃនេះ។',
      totalProjects: 'គម្រោងសរុប',
      activeProjects: 'គម្រោងកំពុងដំណើរការ',
      totalClients: 'អតិថិជនសរុប',
      totalRevenue: 'ចំណូលសរុប',
      outstanding: 'ការទូទាត់នៅសល់',
      financialOverview: 'ទិដ្ឋភាពហិរញ្ញវត្ថុ',
      financialOverviewSub: 'Financial Overview - USD',
      last6Months: '៦ ខែចុងក្រោយ',
      thisYear: 'ឆ្នាំនេះ',
      totalInvoiced: 'វិក្កយបត្រសរុប',
      totalExpenses: 'ចំណាយសរុប',
      netProfit: 'ប្រាក់ចំណេញសុទ្ធ',
      recentProjects: 'គម្រោងថ្មីៗ',
      recentActivities: 'សកម្មភាពថ្មីៗ',
      outstandingInvoices: 'វិក្កយបត្រមិនទាន់ទូទាត់',
      upcomingDeadlines: 'កាលបរិច្ឆេទផុតកំណត់គម្រោង',
      viewAll: 'មើលទាំងអស់',
      projectProgressOverview: 'ទិដ្ឋភាពវឌ្ឍនភាពការងារគម្រោង',
      equipmentDeployment: 'ការដាក់ពង្រាយគ្រឿងចក្រ',
      materialStockAlert: 'ការជូនដំណឹងស្តុកសម្ភារៈ',
    },
    clients: {
      title: 'ការគ្រប់គ្រងអតិថិជន',
      subtitle: 'បញ្ជីឈ្មោះអតិថិជន ក្រុមហ៊ុន និងដៃគូអាជីវកម្ម',
      newClient: 'បន្ថែមអតិថិជនថ្មី',
      clientCode: 'លេខកូដ',
      name: 'ឈ្មោះអតិថិជន / ក្រុមហ៊ុន',
      type: 'ប្រភេទអតិថិជន',
      contactPerson: 'អ្នកទំនាក់ទំនង',
      phone: 'លេខទូរស័ព្ទ',
      email: 'អ៊ីមែល',
      address: 'អាសយដ្ឋាន',
      taxId: 'លេខអត្តសញ្ញាណសារពើពន្ធ (TIN)',
      paymentTerms: 'រយៈពេលទូទាត់ (ថ្ងៃ)',
      projectCount: 'ចំនួនគម្រោង',
      details: 'ព័ត៌មានលម្អិតអតិថិជន',
      projectHistory: 'ប្រវត្តិគម្រោងរបស់អតិថិជន',
    },
    services: {
      title: 'សេវាកម្មវិស្វកម្ម',
      subtitle: 'កាតាឡុកសេវាកម្ម រចនាសម្ព័ន្ធ ស្ថាបត្យកម្ម និង MEP',
      newService: 'បន្ថែមសេវាកម្មថ្មី',
      serviceCode: 'លេខកូដសេវា',
      serviceName: 'ឈ្មោះសេវាកម្ម (អង់គ្លេស)',
      serviceNameKh: 'ឈ្មោះសេវាកម្ម (ខ្មែរ)',
      category: 'ប្រភេទសេវាកម្ម',
      baseRate: 'តម្លៃគោល ($)',
      unit: 'ឯកតាគិត',
      activeStatus: 'ស្ថានភាពសកម្ម',
      description: 'ការពិពណ៌នាសេវាកម្ម',
    },
    projects: {
      title: 'ការគ្រប់គ្រងគម្រោងវិស្វកម្ម',
      subtitle: 'តាមដានស្ថានភាព វឌ្ឍនភាព ថវិកា និងក្រុមការងារលើការដ្ឋាន',
      newProject: 'បង្កើតគម្រោងថ្មី',
      projectCode: 'លេខកូដគម្រោង',
      name: 'ឈ្មោះគម្រោង',
      client: 'អតិថិជន',
      location: 'ទីតាំងការដ្ឋាន',
      budget: 'ថវិកាប៉ាន់ស្មាន',
      actualCost: 'ចំណាយជាក់ស្តែង',
      progress: 'វឌ្ឍនភាព (%)',
      startDate: 'ថ្ងៃចាប់ផ្តើម',
      targetEndDate: 'ថ្ងៃបញ្ចប់តាមផែនការ',
      status: 'ស្ថានភាពគម្រោង',
      members: 'សមាជិកក្រុមការងារ',
      addMember: 'ចាត់តាំងសមាជិកថ្មី',
      recordProgress: 'កត់ត្រាវឌ្ឍនភាពថ្មី',
      timeline: 'តារាងពេលវេលា និងប្រវត្តិ',
      details: 'ព័ត៌មានលម្អិតគម្រោង',
      changeStatus: 'ផ្លាស់ប្តូរស្ថានភាព',
    },
    boq: {
      title: 'បរិមាណការងារ និងការប៉ាន់ស្មាន (BOQ)',
      subtitle: 'ការរៀបចំតម្លៃសម្ភារៈ ពលកម្ម និងការប៉ាន់ប្រមាណថ្លៃដើមគម្រោង',
      newEstimate: 'បង្កើត BOQ ថ្មី',
      estimateCode: 'លេខកូដប៉ាន់ស្មាន',
      project: 'គម្រោង',
      estimateTitle: 'ចំណងជើង BOQ',
      directCost: 'ថ្លៃដើមផ្ទាល់',
      indirectCost: 'ថ្លៃដើមប្រយោល',
      margin: 'ភាគរយចំណេញ (%)',
      totalAmount: 'តម្លៃប៉ាន់ស្មានសរុប',
      version: 'កំណែ (Version)',
      itemsCount: 'ចំនួនមុខទំនិញ',
      addItem: 'បន្ថែមជួរការងារ',
      itemNumber: 'ល.រ',
      itemDesc: 'ការពិពណ៌នាការងារ',
      markup: 'ភាគរយបន្ថែម (%)',
      approveEstimate: 'អនុម័ត BOQ',
    },
    quotations: {
      title: 'សម្រង់តម្លៃ (Quotations)',
      subtitle: 'សំណើដេញថ្លៃ និងសម្រង់តម្លៃជូនអតិថិជន',
      newQuotation: 'បង្កើតសម្រង់តម្លៃថ្មី',
      code: 'លេខកូដសម្រង់តម្លៃ',
      client: 'អតិថិជន',
      project: 'គម្រោង',
      subtotal: 'តម្លៃមុនគិតពន្ធ',
      discount: 'បញ្ចុះតម្លៃ (%)',
      vat: 'អាករលើតម្លៃបន្ថែម VAT (%)',
      total: 'ទឹកប្រាក់សរុប',
      validUntil: 'មានសុពលភាពរហូតដល់',
      terms: 'លក្ខខណ្ឌទូទាត់ និងអនុវត្ត',
      printPdf: 'បោះពុម្ពជា PDF',
      changeStatus: 'ប្តូរស្ថានភាពសម្រង់តម្លៃ',
    },
    contracts: {
      title: 'ការគ្រប់គ្រងកិច្ចសន្យា',
      subtitle: 'កិច្ចសន្យាសាងសង់ ការធានា និងការកែប្រែទំហំការងារ (VO)',
      newContract: 'បង្កើតកិច្ចសន្យាថ្មី',
      code: 'លេខកូដកិច្ចសន្យា',
      contractNumber: 'លេខសម្គាល់កិច្ចសន្យាផ្លូវការ',
      titleField: 'ចំណងជើងកិច្ចសន្យា',
      contractValue: 'តម្លៃកិច្ចសន្យា',
      retention: 'ប្រាក់តម្កល់ធានា (%)',
      period: 'រយៈពេលអនុវត្ត',
      scope: 'វិសាលភាពការងារ',
      amendments: 'ការកែប្រែកិច្ចសន្យា (VO)',
      newVO: 'បង្កើតសំណើ VO ថ្មី',
      voNumber: 'លេខ VO',
      costImpact: 'ផលប៉ះពាល់តម្លៃ ($)',
      scheduleImpact: 'ប៉ះពាល់រយៈពេល (ថ្ងៃ)',
      approveVO: 'អនុម័ត VO',
    },
    finance: {
      title: 'ការគ្រប់គ្រងហិរញ្ញវត្ថុ',
      subtitle: 'វិក្កយបត្រ ការទូទាត់ និងចំណាយលើគម្រោង',
      invoices: 'វិក្កយបត្រចេញ (Invoices)',
      expenses: 'ការចំណាយលើការដ្ឋាន (Expenses)',
      newInvoice: 'ចេញវិក្កយបត្រថ្មី',
      newExpense: 'កត់ត្រាចំណាយថ្មី',
      invoiceNumber: 'លេខវិក្កយបត្រ',
      dueDate: 'កាលបរិច្ឆេទត្រូវទូទាត់',
      paidAmount: 'បានទូទាត់',
      balanceDue: 'នៅសល់ត្រូវទូទាត់',
      recordPayment: 'កត់ត្រាការបង់ប្រាក់',
      paymentMethod: 'វិធីសាស្ត្រទូទាត់',
      paymentRef: 'លេខយោងប្រតិបត្តិការ',
      expenseCategory: 'ប្រភេទចំណាយ',
      vendor: 'អ្នកផ្គត់ផ្គង់ / ហាង',
      receiptNumber: 'លេខបង្កាន់ដៃ',
      approveExpense: 'អនុម័តចំណាយ',
      payExpense: 'ទូទាត់ប្រាក់ចំណាយ',
    },
    inventory: {
      title: 'សម្ភារៈ និងឧបករណ៍គ្រឿងចក្រ',
      subtitle: 'ស្តុកសម្ភារៈសំណង់ គ្រឿងចក្រ និងការចេញ-ចូលឃ្លាំង',
      materials: 'ស្តុកសម្ភារៈសំណង់',
      equipment: 'គ្រឿងចក្រ និងឧបករណ៍',
      movements: 'កំណត់ត្រាចេញ-ចូលស្តុក',
      newMaterial: 'បន្ថែមសម្ភារៈថ្មី',
      newEquipment: 'បន្ថែមគ្រឿងចក្រថ្មី',
      recordMovement: 'កត់ត្រាចេញ/ចូលស្តុក',
      materialCode: 'លេខកូដសម្ភារៈ',
      equipmentCode: 'លេខកូដគ្រឿងចក្រ',
      currentStock: 'ចំនួនក្នុងស្តុក',
      minimumStock: 'កម្រិតស្តុកទាបបំផុត',
      unitCost: 'ថ្លៃដើមឯកតា',
      hourlyRate: 'តម្លៃជួលក្នុងមួយម៉ោង',
      model: 'ម៉ូដែល / ប្រភេទ',
      serial: 'លេខស៊េរី (Serial No)',
      plate: 'ស្លាកលេខ (License Plate)',
      assignToProject: 'ដាក់ពង្រាយទៅការដ្ឋាន',
      returnToYard: 'ប្រគល់ចូលឃ្លាំងវិញ',
      deployedProject: 'ការដ្ឋានកំពុងប្រើប្រាស់',
      movementType: 'ប្រភេទប្រតិបត្តិការ',
    },
    team: {
      title: 'បុគ្គលិក និងក្រុមការងារ',
      subtitle: 'គ្រប់គ្រងគណនីអ្នកប្រើប្រាស់ តួនាទី និងសិទ្ធិប្រើប្រាស់',
      newUser: 'បន្ថែមបុគ្គលិកថ្មី',
      fullName: 'ឈ្មោះពេញ',
      email: 'អ៊ីមែល',
      phone: 'លេខទូរស័ព្ទ',
      jobTitle: 'មុខតំណែង',
      role: 'តួនាទីក្នុងប្រព័ន្ធ',
      status: 'ស្ថានភាពគណនី',
      lastLogin: 'ចូលចុងក្រោយ',
      permissions: 'សិទ្ធិអនុញ្ញាត',
    },
    settings: {
      title: 'ព័ត៌មានក្រុមហ៊ុន និងការកំណត់',
      subtitle: 'ព័ត៌មានផ្លូវការ គណនីធនាគារ និងរូបិយប័ណ្ណ',
      companyNameEn: 'ឈ្មោះក្រុមហ៊ុន (English)',
      companyNameKm: 'ឈ្មោះក្រុមហ៊ុន (ខ្មែរ)',
      regNumber: 'លេខចុះបញ្ជីពាណិជ្ជកម្ម',
      vatTin: 'លេខអត្តសញ្ញាណកម្មអាករ (VAT TIN)',
      email: 'អ៊ីមែលផ្លូវការ',
      phone: 'លេខទូរស័ព្ទផ្លូវការ',
      website: 'គេហទំព័រ',
      address: 'អាសយដ្ឋានការិយាល័យ',
      bankName: 'ឈ្មោះធនាគារ (ABA / Canadia / etc.)',
      bankAccountName: 'ឈ្មោះម្ចាស់គណនី',
      bankAccountNumber: 'លេខគណនីធនាគារ',
      bankSwiftCode: 'លេខកូដ SWIFT',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      dashboardSub: 'Overview & Analytics',
      clients: 'Clients',
      clientsSub: 'Client Directory',
      services: 'Engineering Services',
      servicesSub: 'Service Catalog',
      projects: 'Projects',
      projectsSub: 'Project Management',
      boq: 'BOQ & Estimation',
      boqSub: 'Cost Breakdown',
      quotations: 'Quotations',
      quotationsSub: 'Proposals & Bids',
      contracts: 'Contracts',
      contractsSub: 'Agreements & VOs',
      finance: 'Finance',
      financeSub: 'Invoices & Expenses',
      inventory: 'Materials & Equipment',
      inventorySub: 'Fleet & Stock',
      team: 'Employees / Team',
      teamSub: 'Staff & Roles',
      documents: 'Documents',
      documentsSub: 'Drawings & Files',
      settings: 'Settings',
      settingsSub: 'Company Profile',
      supportTitle: 'Need Help?',
      supportSub: 'EngineerBiz Support',
      contactSupport: 'Contact Support',
    },
    topNav: {
      searchPlaceholder: 'Search projects, clients, or documents...',
      notifications: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No unread notifications',
      profile: 'User Profile',
      settings: 'Settings',
      logout: 'Sign Out',
    },
    common: {
      create: 'Create',
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View Details',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      status: 'Status',
      actions: 'Actions',
      confirm: 'Confirm',
      confirmDelete: 'Are you sure you want to delete this record?',
      confirmDeleteMsg: 'This action cannot be undone.',
      loading: 'Loading data...',
      noData: 'No records found',
      noDataDesc: 'Create a new item or adjust your search filters.',
      back: 'Back',
      submit: 'Submit',
      export: 'Export',
      downloadReport: 'Download Report',
      newProject: 'New Project',
      date: 'Date',
      amount: 'Amount',
      quantity: 'Quantity',
      unit: 'Unit',
      unitPrice: 'Unit Price',
      total: 'Total',
      description: 'Description',
      notes: 'Notes',
      success: 'Operation completed successfully!',
      error: 'An error occurred during request execution.',
      refresh: 'Refresh',
      page: 'Page',
      of: 'of',
      items: 'items',
      showing: 'Showing',
      to: 'to',
      entries: 'entries',
      print: 'Print / Download PDF',
      close: 'Close',
    },
    dashboard: {
      greeting: 'Good morning,',
      subtitle: "Here's a summary of your engineering business operations today.",
      totalProjects: 'Total Projects',
      activeProjects: 'Active Projects',
      totalClients: 'Total Clients',
      totalRevenue: 'Total Revenue',
      outstanding: 'Outstanding',
      financialOverview: 'Financial Overview',
      financialOverviewSub: 'Financial Overview - USD',
      last6Months: 'Last 6 Months',
      thisYear: 'This Year',
      totalInvoiced: 'Total Invoiced',
      totalExpenses: 'Total Expenses',
      netProfit: 'Net Profit',
      recentProjects: 'Recent Projects',
      recentActivities: 'Recent Activities',
      outstandingInvoices: 'Outstanding Invoices',
      upcomingDeadlines: 'Upcoming Project Deadlines',
      viewAll: 'View All',
      projectProgressOverview: 'Project Progress Overview',
      equipmentDeployment: 'Equipment Deployment',
      materialStockAlert: 'Material Stock Alerts',
    },
    clients: {
      title: 'Client Management',
      subtitle: 'Manage client accounts, contacts, and corporate partners',
      newClient: 'New Client',
      clientCode: 'Client Code',
      name: 'Client / Company Name',
      type: 'Client Type',
      contactPerson: 'Contact Person',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      taxId: 'VAT / Tax ID',
      paymentTerms: 'Payment Terms (Days)',
      projectCount: 'Projects',
      details: 'Client Details',
      projectHistory: 'Client Project History',
    },
    services: {
      title: 'Engineering Services',
      subtitle: 'Catalog of structural, civil, architectural, and MEP services',
      newService: 'New Service',
      serviceCode: 'Service Code',
      serviceName: 'Service Name (EN)',
      serviceNameKh: 'Service Name (KM)',
      category: 'Category',
      baseRate: 'Base Rate ($)',
      unit: 'Unit',
      activeStatus: 'Active Status',
      description: 'Description',
    },
    projects: {
      title: 'Project Management',
      subtitle: 'Track status, milestones, site progress, and assigned teams',
      newProject: 'New Project',
      projectCode: 'Project Code',
      name: 'Project Name',
      client: 'Client',
      location: 'Site Location',
      budget: 'Estimated Budget',
      actualCost: 'Actual Cost',
      progress: 'Progress (%)',
      startDate: 'Start Date',
      targetEndDate: 'Target Completion Date',
      status: 'Project Status',
      members: 'Team Members',
      addMember: 'Assign Member',
      recordProgress: 'Record Site Progress',
      timeline: 'Project Timeline & History',
      details: 'Project Details',
      changeStatus: 'Change Status',
    },
    boq: {
      title: 'BOQ & Estimation',
      subtitle: 'Itemized material, labor, direct cost estimation, and markup',
      newEstimate: 'New BOQ Estimate',
      estimateCode: 'Estimate Code',
      project: 'Project',
      estimateTitle: 'Estimate Title',
      directCost: 'Direct Cost',
      indirectCost: 'Indirect Cost',
      margin: 'Margin (%)',
      totalAmount: 'Total Estimated Amount',
      version: 'Version',
      itemsCount: 'Items Count',
      addItem: 'Add BOQ Item',
      itemNumber: 'Item #',
      itemDesc: 'Work Description',
      markup: 'Markup (%)',
      approveEstimate: 'Approve BOQ',
    },
    quotations: {
      title: 'Quotations',
      subtitle: 'Commercial proposals, quotation items, discounts, and client terms',
      newQuotation: 'New Quotation',
      code: 'Quotation Code',
      client: 'Client',
      project: 'Project',
      subtotal: 'Subtotal',
      discount: 'Discount (%)',
      vat: 'VAT (%)',
      total: 'Total Amount',
      validUntil: 'Valid Until',
      terms: 'Terms & Conditions',
      printPdf: 'Print / Export PDF',
      changeStatus: 'Update Status',
    },
    contracts: {
      title: 'Contract Management',
      subtitle: 'Signed agreements, retention rates, and variation orders (VO)',
      newContract: 'New Contract',
      code: 'Contract Code',
      contractNumber: 'Contract Number',
      titleField: 'Contract Title',
      contractValue: 'Contract Value',
      retention: 'Retention Rate (%)',
      period: 'Execution Period',
      scope: 'Scope of Work',
      amendments: 'Variation Orders (VO)',
      newVO: 'New Variation Order',
      voNumber: 'VO Number',
      costImpact: 'Cost Impact ($)',
      scheduleImpact: 'Schedule Impact (Days)',
      approveVO: 'Approve VO',
    },
    finance: {
      title: 'Financial Management',
      subtitle: 'Milestone invoicing, customer receipts, and job-site expenses',
      invoices: 'Invoices',
      expenses: 'Expenses',
      newInvoice: 'New Invoice',
      newExpense: 'Record Expense',
      invoiceNumber: 'Invoice #',
      dueDate: 'Due Date',
      paidAmount: 'Paid Amount',
      balanceDue: 'Balance Due',
      recordPayment: 'Record Payment',
      paymentMethod: 'Payment Method',
      paymentRef: 'Reference Number',
      expenseCategory: 'Category',
      vendor: 'Vendor / Merchant',
      receiptNumber: 'Receipt #',
      approveExpense: 'Approve Claim',
      payExpense: 'Mark as Paid',
    },
    inventory: {
      title: 'Materials & Equipment',
      subtitle: 'Track physical inventory stock and heavy machinery deployments',
      materials: 'Materials Catalog',
      equipment: 'Equipment Fleet',
      movements: 'Inventory Movements',
      newMaterial: 'New Material',
      newEquipment: 'New Equipment',
      recordMovement: 'Record Movement',
      materialCode: 'Material Code',
      equipmentCode: 'Equipment Code',
      currentStock: 'Current Stock',
      minimumStock: 'Minimum Stock',
      unitCost: 'Unit Cost',
      hourlyRate: 'Hourly Rate',
      model: 'Model',
      serial: 'Serial Number',
      plate: 'License Plate',
      assignToProject: 'Deploy to Site',
      returnToYard: 'Return to Yard',
      deployedProject: 'Current Site',
      movementType: 'Movement Type',
    },
    team: {
      title: 'Employees & Team',
      subtitle: 'Manage organizational roles, user credentials, and security',
      newUser: 'New Staff Member',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      jobTitle: 'Job Title',
      role: 'System Role',
      status: 'Status',
      lastLogin: 'Last Login',
      permissions: 'Permissions',
    },
    settings: {
      title: 'Company Profile & Settings',
      subtitle: 'Corporate legal registration, contact details, and bank routing',
      companyNameEn: 'Company Name (English)',
      companyNameKm: 'Company Name (Khmer)',
      regNumber: 'Registration Number',
      vatTin: 'VAT TIN',
      email: 'Official Email',
      phone: 'Official Phone',
      website: 'Website',
      address: 'Office Address',
      bankName: 'Bank Name',
      bankAccountName: 'Account Name',
      bankAccountNumber: 'Account Number',
      bankSwiftCode: 'SWIFT Code',
    },
  },
};

