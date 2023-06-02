import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Add, AddCircleOutlineSharp, PostAdd, Style} from "@material-ui/icons";
import {Link} from "react-router-dom";
import {IconButton} from "@material-ui/core"


type Anchor = 'bottom';


export default function ButtonDrawer(props){
    const [state, setState] = React.useState({
        bottom: false
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event).key === 'Tab' ||
                (event).key === 'Shift')
            ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const links = props.links//["/edit", "/files/view", "/files/upload", '/login'];
    const icons = props.icons//[<EditIcon style={{ color: '#f50057' }}/>, <FolderIcon style={{ color: '#f50057' }}/>, <FileDownloadIcon style={{ color: '#f50057' }}/>, <LogoutIcon style={{ color: '#f50057' }}/>]

    const titles = props.titles //['Редактировать профиль', 'Мои файлы', 'Загрузить файл', 'Выход']
    const positions = props.positions //['right']
    const iconDrawer = props.icon // <SettingsIcon style={{ color: '#f50057' }} fontSize={"large"}/>
    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: "100%" }}
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {titles.map((text,index) => (
                    <ListItem key = {text} disablePadding>
                        <ListItemButton component={Link} to={links[index]}>
                            <ListItemIcon>
                                {icons[index]}
                            </ListItemIcon>
                        <ListItemText primary={text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
    return (
        <div>
            {(positions).map((anchor) => (
                <React.Fragment key={anchor} >
                <IconButton onClick={toggleDrawer(anchor, true)} >
                    {iconDrawer}
                </IconButton>
                <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                sx={{zIndex: 'tooltip'}}
                >
            {list(anchor)}
                </Drawer>
                </React.Fragment>
                ))}
        </div>
    );
}
