import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

export interface Translations {
  [key: string]: string | Translations;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr' },
    { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭', direction: 'ltr' }
  ];

  private currentLanguageSubject = new BehaviorSubject<Language>(this.languages[0]);
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translationsSubject = new BehaviorSubject<Translations>({});
  public translations$ = this.translationsSubject.asObservable();

  private translations: { [lang: string]: Translations } = {
    en: {
      common: {
        home: 'Home',
        jobs: 'Jobs',
        companies: 'Companies',
        marketplace: 'Marketplace',
        services: 'Services',
        projects: 'Projects',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        profile: 'Profile',
        dashboard: 'Dashboard',
        search: 'Search',
        apply: 'Apply',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        close: 'Close',
        loading: 'Loading...',
        currency: 'Currency',
        language: 'Language'
      },
      hero: {
        title: 'Find Your Dream Job',
        subtitle: 'Thousands of jobs and freelance opportunities await',
        searchPlaceholder: 'Job title, keywords, or company',
        locationPlaceholder: 'City or country',
        searchButton: 'Search Jobs'
      },
      jobCard: {
        remote: 'Remote',
        onsite: 'On-site',
        hybrid: 'Hybrid',
        fullTime: 'Full-time',
        partTime: 'Part-time',
        contract: 'Contract',
        freelance: 'Freelance',
        applyNow: 'Apply Now',
        savedJob: 'Saved',
        saveJob: 'Save'
      },
      marketplace: {
        browseServices: 'Browse Services',
        postProject: 'Post a Project',
        becomeFreelancer: 'Become a Freelancer',
        hireFreelancers: 'Hire Freelancers',
        startingAt: 'Starting at',
        budget: 'Budget',
        duration: 'Duration',
        proposals: 'Proposals',
        orderNow: 'Order Now',
        submitProposal: 'Submit Proposal'
      },
      profile: {
        editProfile: 'Edit Profile',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
        portfolio: 'Portfolio',
        reviews: 'Reviews',
        earnings: 'Earnings',
        completedJobs: 'Completed Jobs',
        successRate: 'Success Rate'
      },
      payment: {
        balance: 'Balance',
        deposit: 'Deposit',
        withdraw: 'Withdraw',
        transactions: 'Transactions',
        escrow: 'In Escrow',
        released: 'Released',
        pending: 'Pending',
        completed: 'Completed'
      }
    },
    zh: {
      common: {
        home: '首页',
        jobs: '工作',
        companies: '公司',
        marketplace: '市场',
        services: '服务',
        projects: '项目',
        login: '登录',
        register: '注册',
        logout: '退出',
        profile: '个人资料',
        dashboard: '仪表板',
        search: '搜索',
        apply: '申请',
        submit: '提交',
        cancel: '取消',
        save: '保存',
        edit: '编辑',
        delete: '删除',
        close: '关闭',
        loading: '加载中...',
        currency: '货币',
        language: '语言'
      },
      hero: {
        title: '找到你的理想工作',
        subtitle: '数千个工作和自由职业机会等着你',
        searchPlaceholder: '职位名称、关键词或公司',
        locationPlaceholder: '城市或国家',
        searchButton: '搜索工作'
      },
      jobCard: {
        remote: '远程',
        onsite: '现场',
        hybrid: '混合',
        fullTime: '全职',
        partTime: '兼职',
        contract: '合同',
        freelance: '自由职业',
        applyNow: '立即申请',
        savedJob: '已保存',
        saveJob: '保存'
      },
      marketplace: {
        browseServices: '浏览服务',
        postProject: '发布项目',
        becomeFreelancer: '成为自由职业者',
        hireFreelancers: '雇佣自由职业者',
        startingAt: '起价',
        budget: '预算',
        duration: '期限',
        proposals: '提案',
        orderNow: '立即订购',
        submitProposal: '提交提案'
      },
      profile: {
        editProfile: '编辑资料',
        skills: '技能',
        experience: '经验',
        education: '教育',
        portfolio: '作品集',
        reviews: '评价',
        earnings: '收入',
        completedJobs: '完成的工作',
        successRate: '成功率'
      },
      payment: {
        balance: '余额',
        deposit: '存款',
        withdraw: '提现',
        transactions: '交易',
        escrow: '托管中',
        released: '已释放',
        pending: '待处理',
        completed: '已完成'
      }
    },
    km: {
      common: {
        home: 'ទំព័រដើម',
        jobs: 'ការងារ',
        companies: 'ក្រុមហ៊ុន',
        marketplace: 'ទីផ្សារ',
        services: 'សេវាកម្ម',
        projects: 'គម្រោង',
        login: 'ចូល',
        register: 'ចុះឈ្មោះ',
        logout: 'ចាកចេញ',
        profile: 'ប្រវត្តិរូប',
        dashboard: 'ផ្ទាំងគ្រប់គ្រង',
        search: 'ស្វែងរក',
        apply: 'ដាក់ពាក្យ',
        submit: 'បញ្ជូន',
        cancel: 'បោះបង់',
        save: 'រក្សាទុក',
        edit: 'កែសម្រួល',
        delete: 'លុប',
        close: 'បិទ',
        loading: 'កំពុងផ្ទុក...',
        currency: 'រូបិយប័ណ្ណ',
        language: 'ភាសា'
      },
      hero: {
        title: 'ស្វែងរកការងារក្នុងក្តីស្រមៃរបស់អ្នក',
        subtitle: 'ការងាររាប់ពាន់និងឱកាសការងារឯករាជ្យកំពុងរង់ចាំ',
        searchPlaceholder: 'មុខតំណែង ពាក្យគន្លឹះ ឬក្រុមហ៊ុន',
        locationPlaceholder: 'ទីក្រុង ឬប្រទេស',
        searchButton: 'ស្វែងរកការងារ'
      },
      jobCard: {
        remote: 'ពីចម្ងាយ',
        onsite: 'នៅកន្លែង',
        hybrid: 'ចម្រុះ',
        fullTime: 'ពេញម៉ោង',
        partTime: 'ក្រៅម៉ោង',
        contract: 'កិច្ចសន្យា',
        freelance: 'ឯករាជ្យ',
        applyNow: 'ដាក់ពាក្យឥឡូវនេះ',
        savedJob: 'បានរក្សាទុក',
        saveJob: 'រក្សាទុក'
      },
      marketplace: {
        browseServices: 'រកមើលសេវាកម្ម',
        postProject: 'បង្ហោះគម្រោង',
        becomeFreelancer: 'ក្លាយជាអ្នកធ្វើការឯករាជ្យ',
        hireFreelancers: 'ជួលអ្នកធ្វើការឯករាជ្យ',
        startingAt: 'ចាប់ផ្តើមពី',
        budget: 'ថវិកា',
        duration: 'រយៈពេល',
        proposals: 'សំណើ',
        orderNow: 'បញ្ជាទិញឥឡូវនេះ',
        submitProposal: 'ដាក់សំណើ'
      },
      profile: {
        editProfile: 'កែសម្រួលប្រវត្តិរូប',
        skills: 'ជំនាញ',
        experience: 'បទពិសោធន៍',
        education: 'ការអប់រំ',
        portfolio: 'សំណុំស្នាដៃ',
        reviews: 'ការវាយតម្លៃ',
        earnings: 'ប្រាក់ចំណូល',
        completedJobs: 'ការងារបានបញ្ចប់',
        successRate: 'អត្រាជោគជ័យ'
      },
      payment: {
        balance: 'សមតុល្យ',
        deposit: 'ដាក់ប្រាក់',
        withdraw: 'ដកប្រាក់',
        transactions: 'ប្រតិបត្តិការ',
        escrow: 'កំពុងរក្សាទុក',
        released: 'បានបញ្ចេញ',
        pending: 'កំពុងរង់ចាំ',
        completed: 'បានបញ្ចប់'
      }
    }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = this.languages.find(l => l.code === savedLanguage);
      if (language) {
        this.setLanguage(savedLanguage);
      }
    } else {
      // Set initial translations
      this.translationsSubject.next(this.translations['en']);
    }
  }

  getLanguages(): Language[] {
    return this.languages;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(languageCode: string): void {
    const language = this.languages.find(l => l.code === languageCode);
    if (language) {
      this.currentLanguageSubject.next(language);
      this.translationsSubject.next(this.translations[languageCode]);
      localStorage.setItem('selectedLanguage', languageCode);

      // Update document direction
      document.documentElement.dir = language.direction;
      document.documentElement.lang = languageCode;
    }
  }

  translate(key: string): string {
    const keys = key.split('.');
    let current: any = this.translationsSubject.value;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Return the key if translation not found
        return key;
      }
    }

    return typeof current === 'string' ? current : key;
  }

  instant(key: string): string {
    return this.translate(key);
  }

  // Get nested translations object
  getTranslations(prefix?: string): any {
    const current = this.translationsSubject.value;
    if (!prefix) return current;

    const keys = prefix.split('.');
    let result: any = current;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return {};
      }
    }

    return result;
  }

  // Add or update translations dynamically
  setTranslations(languageCode: string, translations: Translations): void {
    if (this.translations[languageCode]) {
      this.translations[languageCode] = {
        ...this.translations[languageCode],
        ...translations
      };

      // Update current translations if this is the active language
      if (this.currentLanguageSubject.value.code === languageCode) {
        this.translationsSubject.next(this.translations[languageCode]);
      }
    }
  }
}
