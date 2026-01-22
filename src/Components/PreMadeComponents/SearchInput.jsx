import { Button, Input } from "@fluentui/react-components";
import { Dismiss16Regular, Search20Regular } from "@fluentui/react-icons";

export default function SearchInput ({ 
    onChange, 
    placeholder, 
    searchText, 
    handleClearAction, 
    handleSearchAction 
}) {

    const style = {
        display: 'flex',
        width: '100%', 
        padding: '13px', 
        gap: '8px', 
        height: 'fit-content',
        justifyContent: 'center',
    }
    
    return <div className="search-input-div" style={style}>
        <Input 
            className="search-input" 
            contentBefore={<Search20Regular/>}
            contentAfter={<Button icon={<Dismiss16Regular/>} appearance="subtle" onClick={handleClearAction} title='مسح'/>}
            placeholder={placeholder} 
            value={searchText}
            style={{ width: '50%' }}
            onChange={onChange}
            onKeyUp={(e) => {
                if(e.key === 'Enter')
                handleSearchAction?.();
            }}
        />
        <Button 
            title='بحث'
            icon={<Search20Regular/>} 
            style={{minWidth: '89px', height: '100%'}} 
            appearance='primary' 
            onClick={handleSearchAction} 
        />
    </div>
}