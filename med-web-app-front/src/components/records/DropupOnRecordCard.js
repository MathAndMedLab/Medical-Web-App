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



type Anchor = 'bottom';


export default function TemporaryDrawer(){
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

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: 250 }}
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {['Создать пост', 'Страница тэгов'].map((text,index) => (
                    <ListItem key = {text} disablePadding>
                        <ListItemButton component={Link} to={
                            index === 0 ? "/records/create" : "/topics/create"
                        }>
                            <ListItemIcon>
                                {index % 2 ===0 ? <PostAdd color = "secondary"/> : <Style color = "secondary" />}
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
            {(['bottom']).map((anchor) => (
                <React.Fragment key={anchor}>
                <Button onClick={toggleDrawer(anchor, true)}>
                    <AddCircleOutlineSharp color = "secondary" fontSize={"large"}/>
                </Button>
                <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                >
            {list(anchor)}
                </Drawer>
                </React.Fragment>
                ))}
        </div>
    );
}
