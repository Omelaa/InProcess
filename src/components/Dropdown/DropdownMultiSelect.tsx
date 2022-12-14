import {FC, useState, useEffect} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import {IFilters} from "../../pages";

import cn from 'classnames';
import css from './DropdownMultiSelect.style.scss';
import {useAppDispatch, useAppSelector} from "../../hooks";

import {setItemId, setCapacityId} from "../../store/slices/filter.slice";
import {getFilteredRooms} from '../../store';
import {InstrumentsProps, IRooms} from "../../models";
// import {useStyle} from '../../hooks';
import {makeStyles} from "@material-ui/styles";

interface FilterProps {
    selected?: string,
    setSelected?: any,
    filterItems: InstrumentsProps[],
    filterCapacity?: IFilters[],
    name?: string,
    rooms: IRooms[]
};

const useStyles: any = makeStyles({
    select: {
        "& ul": {
            // backgroundColor:"rgba(197,197,197,0.7)",
            // borderRadius: 0,
            // backdropFilter: "blur(20px)",
            "& svg": {
                // color: "rgba(197,197,197,0.26)"
                },
        }
    }})

const DropdownMultiSelect: FC<FilterProps> = (({filterItems, filterCapacity, name, rooms}) => {
        const [personName, setPersonName] = useState<string[]>([]);
        const classes = useStyles();
        const {itemId, capacityId} = useAppSelector(state => state.filterRoom);
        const dispatch = useAppDispatch();

        useEffect(() => {
            dispatch(getFilteredRooms(rooms.filter((room) => {
                const roomCurrent = room.equipments.map(item => item.id);
                const isValidEquipment = itemId.every(id => roomCurrent.includes(id));
                const capacity = room.maxCapacity;
                const isCapacitySelected = capacityId.length === 0
                const isValidCapacity = isCapacitySelected || capacityId.some(range => capacity > range[0] && capacity <= range[1]);
                return isValidEquipment && isValidCapacity;
            })))
        }, [itemId, capacityId]);

        const onChangeItemId = (id: number) => {
            dispatch(setItemId(id))
        };
        const onChangeCapacityId = (id: [number, number]) => {
            dispatch(setCapacityId(id))
        };

        const handleChange = (event: SelectChangeEvent<typeof personName>) => {
            const {
                target: {value},
            } = event;
            setPersonName(
                typeof value === 'string' ? value.split(',') : value,
            );
        };

        return (
            <div className={'filter_form'}>
                <FormControl sx={{m: 1, width: 300}}>
                    <InputLabel id="demo-multiple-checkbox-label" className={'filter_form__input'}>{name}</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput label={name}/>}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={{ classes: { paper: classes.select}, disablePortal: true }}
                    >
                        <div className={css.filter_text}>
                            Filter by capacity
                        </div>
                        {filterCapacity && filterCapacity.map((item) => (
                            <MenuItem className={cn('menuItem')}
                                      key={item.id}
                                      value={item.name}>
                                <Checkbox checked={personName.indexOf(item.name) > -1}
                                          onChange={() => onChangeCapacityId(item.range)}
                                />
                                <ListItemText primary={item.name}/>
                            </MenuItem>
                        ))}
                        <div className={css.filter_text}>
                            Filter by items
                        </div>
                        {filterItems.map((item) => (
                            <MenuItem className={cn('menuItem')}
                                      key={item.id}
                                      value={item.name}
                            >
                                <Checkbox checked={personName.indexOf(item.name) > -1}
                                          onChange={() => onChangeItemId(item.id)}
                                />
                                <ListItemText primary={item.name}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        );
    }
);

export {DropdownMultiSelect};