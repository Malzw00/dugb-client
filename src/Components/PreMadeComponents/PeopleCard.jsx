import { Avatar } from "@fluentui/react-components";
import { Person24Regular } from "@fluentui/react-icons";

export default function PersonCard({ name, index, type, id, onClick }) {

    return (
        <div key={index} className="person-card" onClick={onClick?? (()=>{})}>
            <Avatar>
                <Person24Regular/>
            </Avatar>
            <div>{name}</div>
        </div>
    );
} 