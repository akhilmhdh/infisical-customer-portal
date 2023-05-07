"use client"

import {
    TableContainer,
    Table,
    THead,
    Tr,
    Td,
    Th,
    TBody,
    TableSkeleton,
    IconButton,
    EmptyState
} from '@/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    apiRequest 
} from '../../config';
import { 
  useGetOrganizations,
  useGetOrganizationPmtMethods
} from '@/hooks/api';

// TODO: layout, license stuff etc.

// we want: test STRIPE_KEY to get customer information?
// display Cloud stuff as well here or no?

// connect to Stripe
// AKA fetching data!
// render Cloud Plan
// render licenses
// set up table structure

const EMAILS = [
    {
        email: 'dangtony98@gmail.com'
    },
    {
        email: 'dangtony98+1@gmail.com'
    }
];

export default function DashboardPage() {
    const { data, isLoading, isFetching, error } = useGetOrganizations();
    const { data: data2 } = useGetOrganizationPmtMethods('');
    
    console.log('data2: ', data2);
    
    if (!isLoading) {
        console.log('data: ', data);
    }

    return (
        <div>
            Hello from the Dashboard Page
        
            Render licenses below
            <TableContainer>
          <Table>
            <THead>
              <Tr>
                <Th>Email</Th>
                <Th aria-label="actions" />
              </Tr>
            </THead>
            <TBody>
              {/* {isLoading && <TableSkeleton columns={2} key="incident-contact" />} */}
              {EMAILS.map(({ email }) => (
                <Tr key={email}>
                  <Td className="w-full">{email}</Td>
                  {/* <Td className="mr-4">
                    <IconButton
                      ariaLabel="delete"
                      colorSchema="danger"
                      onClick={() => handlePopUpOpen('removeContact', { email })}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Td> */}
                </Tr>
              ))}
            </TBody>
          </Table>
          {/* {filteredContacts?.length === 0 && !isLoading && (
            <EmptyState title="No incident contacts found" icon={faContactBook} />
          )} */}
        </TableContainer>
        </div>
    );
}