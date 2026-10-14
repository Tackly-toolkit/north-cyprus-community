-- 009: property to rent / for sale in the marketplace
alter table public.lists drop constraint if exists lists_kind_check;
alter table public.lists add constraint lists_kind_check check (kind in ('condition','currency','handover','bedrooms','furnished'));
insert into public.lists(kind,value,sort) values
 ('bedrooms','Studio',0),('bedrooms','1 bedroom',1),('bedrooms','2 bedrooms',2),('bedrooms','3 bedrooms',3),('bedrooms','4 bedrooms',4),('bedrooms','5 or more bedrooms',5),
 ('furnished','Furnished',0),('furnished','Part furnished',1),('furnished','Unfurnished',2)
on conflict do nothing;
alter table public.listings add column if not exists period text check (period in ('month')), add column if not exists bedrooms text, add column if not exists furnished text;
insert into public.categories(id,kind,parent_id,name,sort) values
 ('market-rent','market',null,'Property to rent',20),
 ('market-rent-apartment','market','market-rent','Apartment',0),
 ('market-rent-villa','market','market-rent','Villa or house',1),
 ('market-rent-room','market','market-rent','Room',2),
 ('market-rent-land','market','market-rent','Land or commercial',3),
 ('market-sale','market',null,'Property for sale',21),
 ('market-sale-apartment','market','market-sale','Apartment',0),
 ('market-sale-villa','market','market-sale','Villa or house',1),
 ('market-sale-land','market','market-sale','Land',2),
 ('market-sale-commercial','market','market-sale','Commercial',3)
on conflict do nothing;
update public.categories set sort=-2 where id='market-rent';
update public.categories set sort=-1 where id='market-sale';
insert into public.lists(kind,value,sort) values ('bedrooms','Not applicable (land or commercial)',-1),('furnished','Not applicable',-1) on conflict do nothing;
