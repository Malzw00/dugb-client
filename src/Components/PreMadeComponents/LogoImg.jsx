export default function LogoImg (props) {

    return (
        <img 
            {...props} 
            alt={props.alt?? ''}
            className={'logo-img ' + (props.className ?? '')}
        />
    )
}
