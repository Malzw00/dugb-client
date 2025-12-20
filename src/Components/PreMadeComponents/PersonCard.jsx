import { Avatar } from "@fluentui/react-components";
import { Person24Regular } from "@fluentui/react-icons";
import { setPerson } from "@root/src/store/slices/person.slice";
import { useDispatch } from "react-redux";

export default function PersonCard({ name, index, onClick, updated_at }) {

    return (
        <div key={index} className="person-card" onClick={onClick?? (()=>{})}>
            <Avatar style={{border: '1px solid silver'}}>
                <Person24Regular/>
            </Avatar>
            <div>
                <p>{name}</p>
                {updated_at && <p className="placeholder-label" style={{fontSize:'12px'}}>
                    آخر تحديث: {new Date(updated_at).toISOString().slice(0, 10)}
                </p>}
            </div>
            
        </div>
    );
} 