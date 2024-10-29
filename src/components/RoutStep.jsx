import { Icon123 } from "@tabler/icons-react";
import * as TablerIcons from 'tabler-icons-react';

const RoutStep = ({ iconName, liCss = '', divCss = '', iconCss = '' }) => {
    const Icon = TablerIcons[iconName];
    if (!Icon) {
        return (
            <li className={`${liCss}`}>
                <div className={`${divCss}`}>
                    <Icon123 className={`${iconCss}`} />
                </div>
            </li >
        );
    }
    return (
        <li className={`${liCss}`}>
            <div className={`${divCss}`}>
                <Icon className={`${iconCss}`} />
            </div>
        </li>
    );
}

export default RoutStep;