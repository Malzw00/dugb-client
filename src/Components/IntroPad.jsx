import React from 'react';
import logo from '@resources/logoHQ.png';
import { 
    Button, Display, Text, Card, CardHeader, 
    makeStyles, tokens, shorthands 
} from '@fluentui/react-components';
import { 
    ArrowLeft24Filled, 
    DocumentBulletListMultiple24Regular, 
    DocumentSearch24Regular, 
    DataHistogram24Regular 
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import Header from './HomePad/Header';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: tokens.colorNeutralBackground2,
        direction: 'rtl',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '40px',
        padding: '0px 8%',
        flexGrow: 1,
        alignItems: 'center',
        overflow: 'auto',
        '@media (max-width: 900px)': {
            gridTemplateColumns: '1fr',
            padding: '20px',
        }
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    logoCard: {
        ...shorthands.padding('24px'),
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderRadius('20px'),
        boxShadow: tokens.shadow2,
        display: 'flex',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        maxWidth: '180px', // حجم أصغر وأكثر أناقة
        height: 'auto',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderRadius(tokens.borderRadiusLarge),
        transition: 'all 0.2s ease-in-out',
        boxShadow: tokens.shadow2,
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground1Hover,
            transform: 'translateX(5px)', 
        }
    },
    mainSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    titleGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    mainTitle: {
        color: tokens.colorBrandForeground1,
        fontSize: '2.5rem',
        // fontWeight: '800',
        lineHeight: '1.2',
        fontFamily: `'Segoe UI', `
    },
    descriptionCard: {
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: '5px',
        boxShadow: tokens.shadow2,
        ...shorthands.padding('16px'),
    },
    teamCard: {
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.border('0px'),
        borderRadius: '5px',
        boxShadow: tokens.shadow2,
    },
    highlight: {
        color: tokens.colorBrandForeground1,
        fontWeight: 'bold',
    },
    footer: {
        ...shorthands.padding('8px'),
        textAlign: 'center',
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    }
});

export default function IntroUI({ onContinue }) {
    
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <Header disableTabs />
            
            <div className={styles.content}>
                
                {/* Right Side */}
                <div className={styles.sidebar}>
                    <div className={styles.logoCard}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                    </div>
                    
                    <div className={styles.featureItem}>
                        <DocumentBulletListMultiple24Regular color={tokens.colorBrandForeground1} />
                        <Text size={300} weight="medium">أرشفة مشاريع التخرج</Text>
                    </div>
                    <div className={styles.featureItem}>
                        <DocumentSearch24Regular color={tokens.colorBrandForeground1} />
                        <Text size={300} weight="medium">
                            نهدف إلى تسهيل الوصول إلى المشاريع من خلال أدوات بحث وتصنيف متنوعة.
                        </Text>
                    </div>
                    <div className={styles.featureItem}>
                        <DataHistogram24Regular color={tokens.colorBrandForeground1} />
                        <Text size={300} weight="medium">تقييم ومشاركة الآراء</Text>
                    </div>
                </div>

                {/* Left Side */}
                <div className={styles.mainSection}>
                    <div className={styles.titleGroup}>
                        <Display className={styles.mainTitle}>منصة توثيق مشاريع التخرج الجامعية</Display>
                        <Text size={600} weight="semibold">جامعة أجدابيا</Text>
                    </div>

                    <div className={styles.descriptionCard}>
                        <Text size={400}>
                            نظام يهدف إلى أتمتة وحفظ النتاج العلمي للطلبة، وتسهيل الوصول إلى المعرفة الأكاديمية.
                        </Text>
                    </div>

                    <Card className={styles.teamCard}>
                        <CardHeader 
                            header={<Text weight="bold" size={400}>فريق العمل</Text>} 
                        />
                        <Text size={200}>
                            <span className={styles.highlight}>تطوير:
                                </span> معاذ مفتاح عمران، سعيد جاد المولى سعيد، محمد سالم علي، علي السنوسي عقيلة
                        </Text>
                        <Text size={200}>
                            <span className={styles.highlight}>إشراف:</span> أ. قاسم حداد
                        </Text>
                    </Card>

                    <div style={{ marginTop: '10px' }}>
                        <EnterButton onContinue={onContinue} />
                    </div>
                </div>
            </div>

            <footer className={styles.footer}>
                <Text size={200} font="numeric">
                   جامعة أجدابيا – جميع الحقوق محفوظة © 2025–2026
                </Text>
            </footer>
        </div>
    );
}

function EnterButton({ onContinue }) {
    const navigate = useNavigate();

    return (
        <Button
            size="large"
            appearance="primary"
            icon={<ArrowLeft24Filled />} // أيقونة سهم لليسار تناسب الدخول بالعربي
            iconPosition="after"
            shape="rounded"
            onClick={() => {
                if(sessionStorage['FstLoad'] === 'true') {    
                    navigate(-1);
                    return;
                }
                onContinue();
                sessionStorage.setItem('FstLoad', 'true');
            }}
            style={{ padding: '0 40px', height: '48px' }}
        >
            دخول المنصة
        </Button>
    );
}